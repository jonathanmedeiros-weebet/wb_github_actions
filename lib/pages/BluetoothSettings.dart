import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
import 'package:esc_pos_utils_plus/esc_pos_utils.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image/image.dart' as img;
import 'dart:io';

class BluetoothSettings extends StatefulWidget {
  @override
  _BluetoothSettingsState createState() => _BluetoothSettingsState();
}

class _BluetoothSettingsState extends State<BluetoothSettings> {
  String? printerName;
  String? printerMAC;
  int? rollWidth = 58;
  int? printGraphics = 1;
  List availableBluetoothDevices = [];
  bool connected = false;
  static const List<int> availableRollWidths = [58, 80];

  @override
  void initState() {
    super.initState();
    this._getPrinter();
  }

  Future<void> getBluetooth() async {
    final List? bluetooths = await BluetoothThermalPrinter.getBluetooths;
    print("Print $bluetooths");
    setState(() {
      availableBluetoothDevices = bluetooths!;
    });
  }

  _getPrinter() async {
    final prefs = await SharedPreferences.getInstance();

    setState(() {
      this.printerName = prefs.getString('printer_name') ?? null;
      this.printerMAC = prefs.getString('printer_mac') ?? null;
      this.rollWidth = prefs.getInt('printer_rollwidth') ?? 0;
      this.printGraphics = prefs.getInt('print_graphics') ?? 1;
    });

    print('Dados da Impressora');
    print(
        'Nome: ${this.printerName} / MAC: ${this.printerMAC} / RollWidth: ${this.rollWidth}');
  }

  _setPrinter(String? name, String? mac) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('printer_name', name!);
    prefs.setString('printer_mac', mac!);
  }

  _setPrinterRollWidth(int? rollWidth) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('printer_rollwidth', rollWidth!);
  }

  _setPrintGraphics(int? printGraphics) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('print_graphics', printGraphics!);
  }

  Future<void> setConnect(String mac) async {
    final String? result = await BluetoothThermalPrinter.connect(mac);
    print("state connected $result");
    if (result == "true") {
      setState(() {
        connected = true;
      });
    }
  }

  Future<List<int>> getTicket() async {
    List<int> bytes = [];
    CapabilityProfile profile = await CapabilityProfile.load();
    var paperSize = this.rollWidth == 58 || this.rollWidth == 0
        ? PaperSize.mm58
        : PaperSize.mm80;
    final generator = Generator(paperSize, profile);

    if (this.printGraphics == 0) {
      bytes += generator.text("Weebet",
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

    bytes += generator.text("Weebet - Sistema de Aposta",
        styles: PosStyles(align: PosAlign.center));

    bytes += generator.hr();

    bytes += generator.text(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent malesuada turpis eget turpis fermentum, ac.',
        styles: PosStyles(align: PosAlign.center, bold: false),
        linesAfter: 5);
    return bytes;
  }

  Future<void> _printTest() async {
    if (this.printerMAC != null) {
      List<int> bytes = await getTicket();
      String? isConnected = await BluetoothThermalPrinter.connectionStatus;

      if (isConnected == "true") {
        await BluetoothThermalPrinter.writeBytes(bytes);
      } else {
        String? connected =
            await BluetoothThermalPrinter.connect(this.printerMAC!);
        if (connected == "true") {
          await BluetoothThermalPrinter.writeBytes(bytes);
        } else {
          print('Falha na impressão!');
          this._printFailedDialog();
        }
      }
    }
  }

  _printFailedDialog() {
    return showDialog<String>(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Falha na Impressão'),
        content: Text('Não foi possível imprimir. Tente novamente mais tarde.'),
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
        title: Text('Configurações de Impressora'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Map printerSettings = {
              'printerMac': this.printerMAC,
              'printerName': this.printerName,
              'rollWidth': this.rollWidth,
              'printGraphics': this.printGraphics
            };
            Navigator.of(context).pop(printerSettings);
          },
        ),
      ),
      body: Column(
        children: [
          ListTile(
            title: Text('Impressora Padrão'),
            subtitle: Text(this.printerName ?? 'Clique para selecionar'),
            onTap: () {
              setState(() {
                this.printerName = 'Selecione um dispositivo abaixo';
                this.printerMAC = null;
                this.rollWidth = 0;
              });
              this.getBluetooth();
            },
            onLongPress: () {},
          ),
          if (this.printerMAC != null && this.printerName != null) Divider(),
          if (this.printerMAC != null && this.printerName != null)
            ListTile(
              title: Text('Tamanho do Rolo'),
              subtitle: Column(
                children: [
                  Container(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Container(
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    flex: 1,
                                    child: RadioListTile(
                                      title:
                                          Text('${availableRollWidths[0]} mm'),
                                      value: availableRollWidths[0],
                                      groupValue: this.rollWidth,
                                      selected: this.rollWidth != null
                                          ? (this.rollWidth ==
                                                  availableRollWidths[0]
                                              ? true
                                              : false)
                                          : false,
                                      onChanged: (int? value) {
                                        setState(() {
                                          this._setPrinterRollWidth(value);
                                          this.rollWidth = value;
                                        });
                                      },
                                    ),
                                  ),
                                  Expanded(
                                      flex: 1,
                                      child: RadioListTile(
                                        title: Text(
                                            '${availableRollWidths[1]} mm'),
                                        value: availableRollWidths[1],
                                        groupValue: this.rollWidth,
                                        selected: this.rollWidth != null
                                            ? (this.rollWidth ==
                                                    availableRollWidths[1]
                                                ? true
                                                : false)
                                            : false,
                                        onChanged: (int? value) {
                                          setState(() {
                                            this._setPrinterRollWidth(value);
                                            this.rollWidth = value;
                                          });
                                        },
                                      ))
                                ],
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
            ListTile(
              title: Text('Imprimir Elementos Gráficos'),
              subtitle: Column(
                children: [
                  Container(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Container(
                          child: Column(
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    flex: 1,
                                    child: RadioListTile(
                                      title:
                                          Text('Sim'),
                                      value: 1,
                                      groupValue: this.printGraphics,
                                      selected: this.printGraphics != null
                                            ? (this.printGraphics ==
                                                    1
                                                ? true
                                                : false)
                                            : false,
                                      onChanged: (int? value) {
                                        setState(() {
                                          this._setPrintGraphics(value);
                                          this.printGraphics = value;
                                        });
                                      },
                                    ),
                                  ),
                                  Expanded(
                                      flex: 1,
                                      child: RadioListTile(
                                        title: Text(
                                            'Não'),
                                        value: 0,
                                        groupValue: this.printGraphics,
                                        selected: this.printGraphics != null
                                            ? (this.printGraphics ==
                                                    0
                                                ? true
                                                : false)
                                            : false,
                                        onChanged: (int? value) {
                                          setState(() {
                                            this._setPrintGraphics(value);
                                            this.printGraphics = value;
                                          });
                                        },
                                      ))
                                ],
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          Divider(),
          if (this.printerMAC != null &&
              this.printerName != null &&
              this.rollWidth != 0)
            ListTile(
              title: ElevatedButton(
                child: Text('Testar Impressão'),
                onPressed: () async {
                  this._printTest();
                },
              ),
            ),
          if (availableBluetoothDevices.length > 0)
            ListTile(
              leading: Icon(Icons.print),
              title: Text("Dispositivos Disponíveis"),
            ),
          Expanded(
            child: ListView.builder(
              itemCount: availableBluetoothDevices.length > 0
                  ? availableBluetoothDevices.length
                  : 0,
              itemBuilder: (context, index) {
                return ListTile(
                  onTap: () {
                    String select = availableBluetoothDevices[index];
                    List list = select.split("#");
                    String name = list[0];
                    String mac = list[1];
                    this.setConnect(mac);

                    setState(() {
                      this.availableBluetoothDevices = [];
                      this._setPrinter(name, mac);
                      this._setPrinterRollWidth(0);
                      this._getPrinter();
                    });
                  },
                  title:
                      Text('${availableBluetoothDevices[index].split('#')[0]}'),
                  subtitle: Text("Clique para selecionar"),
                );
              },
            ),
          )
        ],
      ),
    );
  }
}
