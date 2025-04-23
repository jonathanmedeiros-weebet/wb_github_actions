import 'package:flutter/material.dart';
import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
import 'package:image/image.dart' as img;
import 'package:esc_pos_utils_plus/esc_pos_utils_plus.dart';
import 'package:flutter/services.dart';

import 'package:weebet_mobile/services/printer_service.dart';
import 'package:weebet_mobile/services/storage_service.dart';

class PrinterSettingsPage extends StatefulWidget {
  const PrinterSettingsPage({super.key});

  @override
  State<PrinterSettingsPage> createState() => _PrinterSettingsPageState();
}

class _PrinterSettingsPageState extends State<PrinterSettingsPage> {
  final StorageService _storageService = StorageService();
  final PrinterService _printerService = PrinterService();

  String? printerName;
  String? printerMAC;
  int printerRollWidth = 0;
  int frontVersion = 2;
  bool? printGraphics;
  late Map printer;
  List availableBluetoothDevices = [];
  bool connected = false;
  bool printingTest = false;
  static const List<int> availableRollWidths = [58, 80];

  @override
  void initState() {
    super.initState();
    _getConfiguredPrinter();
  }

  getBluetoothDevices() async {
    final List? bluetooths = await _printerService.getBluetoothDevices();
    setState(() {
      availableBluetoothDevices = bluetooths!;
    });
  }

  Future<void> setConnect(String mac) async {
    final String? result = await BluetoothThermalPrinter.connect(mac);
    if (result == "true") {
      setState(() {
        connected = true;
      });
    }
  }

  _getConfiguredPrinter() async {
    printer = await _storageService.getConfiguredPrinter();
    frontVersion = await _storageService.getFrontVersion() ?? 2;

    setState(() {
      printerName = printer['printerName'];
      printerMAC = printer['printerMAC'];
      printerRollWidth = printer['printerRollWidth'];
      printGraphics = printer['printGraphics'];
    });
  }

  _setPrinter(String? name, String? mac) {
    _storageService.setPrinter(name, mac);
  }

  _setPrinterRollWidth(int? rollWidth) {
    _storageService.setPrinterRollWidth(rollWidth);
  }

  _setPrintGraphics(bool? printGraphics) {
    _storageService.setPrintGraphics(printGraphics);
  }

  _getTicket() async {
    List<int> bytes = [];
    CapabilityProfile profile = await CapabilityProfile.load();
    var paperSize = (printerRollWidth == 58 || printerRollWidth == 0)
        ? PaperSize.mm58
        : PaperSize.mm80;

    final generator = Generator(paperSize, profile);

    if (printGraphics == false) {
      bytes += generator.text("Lorem ipsum",
          // ignore: prefer_const_constructors
          styles: PosStyles(
            align: PosAlign.center,
            height: PosTextSize.size2,
            width: PosTextSize.size2,
          ),
          linesAfter: 1);
    } else {
      final ByteData data = await rootBundle.load('assets/logo_banca.png');
      final Uint8List imgBytes = data.buffer.asUint8List();
      final img.Image imageToPrint = img.decodeImage(imgBytes)!;
      bytes += generator.image(imageToPrint);
    }

    bytes += generator.hr();

    bytes += generator.text(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada turpis eget turpis fermentum, ac.',
        // ignore: prefer_const_constructors
        styles: PosStyles(align: PosAlign.center, bold: false),
        linesAfter: 5);
    return bytes;
  }

  _printTest() async {
    if (printerMAC != null) {
      List<int> bytes = await _getTicket();
      String? isConnected = await BluetoothThermalPrinter.connectionStatus;

      if (isConnected == "true") {
        await BluetoothThermalPrinter.writeBytes(bytes);
      } else {
        String? connected = await BluetoothThermalPrinter.connect(printerMAC!);
        if (connected == "true") {
          await BluetoothThermalPrinter.writeBytes(bytes);
        } else {
          _printFailedDialog();
        }
      }
    }
  }

  _printFailedDialog() {
    return showDialog<String>(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Falha na Impressão'),
        content: const Text(
            'Não foi possível imprimir. Tente novamente mais tarde.'),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.pop(context, 'Ok'),
            child: const Text('Ok'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Configurações de Impressora'),
      ),
      body: Column(
        children: [
          ListTile(
            title: const Text('Impressora Padrão'),
            subtitle: Text(printerName ?? 'Clique para selecionar'),
            onTap: (() {
              getBluetoothDevices();
              setState(() {
                if (availableBluetoothDevices != []) {
                  printerName = 'Selecione um dispositivo abaixo';
                  printerMAC = null;
                  printerRollWidth = 0;
                } else {
                  printerName =
                      'Não foi possível recuperar a lista de dispositivos';
                }
              });
            }),
          ),
          if (printerMAC != null && printerName != null) const Divider(),
          if (printerMAC != null && printerName != null)
            ListTile(
              title: const Text('Tamanho do Rolo'),
              subtitle: Row(
                children: [
                  Expanded(
                      child: RadioListTile(
                          title: Text('${availableRollWidths[0]} mm'),
                          value: availableRollWidths[0],
                          groupValue: printerRollWidth,
                          selected: printerRollWidth != 0
                              ? (printerRollWidth == availableRollWidths[0]
                                  ? true
                                  : false)
                              : false,
                          onChanged: (int? value) {
                            setState(() {
                              _setPrinterRollWidth(value);
                              printerRollWidth = value ?? 58;
                            });
                          })),
                  Expanded(
                      child: RadioListTile(
                          title: Text('${availableRollWidths[1]} mm'),
                          value: availableRollWidths[1],
                          groupValue: printerRollWidth,
                          selected: printerRollWidth != 0
                              ? (printerRollWidth == availableRollWidths[1]
                                  ? true
                                  : false)
                              : false,
                          onChanged: (int? value) {
                            setState(() {
                              _setPrinterRollWidth(value);
                              printerRollWidth = value ?? 80;
                            });
                          })),
                ],
              ),
            ),
          ListTile(
            title: const Text('Imprimir elementos Gráficos'),
            subtitle: Row(children: [
              Expanded(
                  child: RadioListTile(
                      title: const Text('Sim'),
                      value: true,
                      groupValue: printGraphics,
                      selected: printGraphics == true,
                      onChanged: ((bool? value) {
                        setState(() {
                          _setPrintGraphics(value);
                          printGraphics = value ?? true;
                        });
                      }))),
              Expanded(
                  child: RadioListTile(
                      title: const Text('Não'),
                      value: false,
                      groupValue: printGraphics,
                      selected: printGraphics == false,
                      onChanged: ((bool? value) {
                        setState(() {
                          _setPrintGraphics(value);
                          printGraphics = value ?? false;
                        });
                      }))),
            ]),
          ),
          const Divider(),
          if (printerMAC != null &&
              printerName != null &&
              printerRollWidth != 0)
            ListTile(
              title: ElevatedButton(
                  onPressed: !printingTest
                      ? () async {
                          setState(() {
                            printingTest = true;
                          });
                          await _printTest();
                          setState(() {
                            printingTest = false;
                          });
                        }
                      : null,
                  child: Text(
                      printingTest ? 'Imprimindo...' : 'Testar Impressão')),
            ),
          Expanded(
              child: ListView.builder(
                  itemCount: availableBluetoothDevices.isNotEmpty
                      ? availableBluetoothDevices.length
                      : 0,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(
                          '${availableBluetoothDevices[index].split('#')[0]}'),
                      subtitle: const Text('Clique para selecionar'),
                      onTap: () {
                        String select = availableBluetoothDevices[index];
                        List list = select.split("#");
                        String name = list[0];
                        String mac = list[1];
                        setConnect(mac);

                        setState(() {
                          availableBluetoothDevices = [];
                          _setPrinter(name, mac);
                          _setPrinterRollWidth(0);
                          _getConfiguredPrinter();
                        });
                      },
                    );
                  })),
          // Text('System Version: ', style: const TextStyle(color: Color.fromARGB(255, 34, 36, 38)),),
          RichText(
              text: TextSpan(
                  style:
                      const TextStyle(color: Color.fromARGB(255, 34, 36, 38)),
                  children: [
                const TextSpan(
                    text: 'System Version: ',
                    style: TextStyle(fontWeight: FontWeight.w600)),
                TextSpan(text: frontVersion.toString()),
                const TextSpan(
                    text: ' APK Version:',
                    style: TextStyle(fontWeight: FontWeight.w600)),
                const TextSpan(text: '3')
              ]))
        ],
      ),
    );
  }
}
