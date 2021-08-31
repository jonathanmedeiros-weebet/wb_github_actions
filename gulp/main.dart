import 'dart:io';
import 'dart:convert';
import 'dart:typed_data';
import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart' as syspaths;

//Page and my imports
import 'package:weebet/pages/BluetoothSettings.dart';

//Layout Imports
import 'layout/EmptyBar.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '[NOME_BANCA]',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      darkTheme: ThemeData.dark(),
      home: MyHomePage(title: '[NOME_BANCA]'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  WebViewController? _webViewController;
  String? printerName;
  String? printerMAC;
  int? printerRollWidth = 58;
  String? isConnected;
  bool? pageReload = false;

  @override
  void initState() {
    super.initState();
    this._getPrinter();
    this._sendRollWidth(this.printerRollWidth);
  }

  _getPrinter() async {
    final prefs = await SharedPreferences.getInstance();

    this.printerName = prefs.getString('printer_name') ?? null;
    this.printerMAC = prefs.getString('printer_mac') ?? null;

    print('Dados da Impressora - Main Method');
    print('Nome: ${this.printerName} / MAC: ${this.printerMAC}');
  }

  _executePostMessageAction(postMessage) {
    switch (postMessage['action']) {
      case 'listPrinters':
        {
          print('Listar Impressoras');
          this._listPrinters();
        }
        break;
      case 'shareURL':
        {
          print('Compartilhamento');
          this._shareTicket(postMessage);
        }
        break;
      case 'externalURL':
        {
          print('externalURL');
        }
        break;
      case 'printLottery':
        {
          List<int> bytesToPrint = List<int>.from(postMessage['data']);
          this._printByte(bytesToPrint);
          print('Print action');
        }
        break;
      default:
        {
          print('default switch');
        }
        break;
    }
  }

  _listPrinters() async {
    Map printerSettings = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => BluetoothSettings()),
    );
    this._sendRollWidth(printerSettings['rollWidth']);
    setState(() {
      print('Getting printer settings');
      this._getPrinter();
    });
  }

  Future<void> _printByte(bytes) async {
    if (this.printerMAC != null) {
      this.isConnected = await BluetoothThermalPrinter.connectionStatus;

      if (this.isConnected == "true") {
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
    } else {
      print('Não existe impressora configurada!');
      this._noPrinterConfiguredDialog();
    }
  }

  _noPrinterConfiguredDialog() {
    return showDialog<String>(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('Falha na Impressão'),
        content: const Text('Você não possui impressora configurada'),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.pop(context, 'Cancel'),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context, 'ok');
              this._listPrinters();
            },
            child: const Text('Configurar Impressora'),
          ),
        ],
      ),
    );
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

  _shareTicket(var ticket) async {
    ticket['file'] = ticket['file'].replaceAll('data:image/png;base64,', '');
    Uint8List imageBytes = base64.decode(ticket['file']);
    final appDir = await syspaths.getTemporaryDirectory();
    File file = File('${appDir.path}/ticket.png');

    await file.writeAsBytes(imageBytes);

    await Share.shareFiles(['${appDir.path}/ticket.png'],
        text: ticket['message'], subject: 'Compartilhamento de Bilhete');
  }

  _sendRollWidth(int? rollWidth) async {
    _webViewController?.evaluateJavascript("""
    window.postMessage({action: 'printerWidth', width: $rollWidth}, '*');
    """);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: EmptyAppBar(),
      body: WebView(
        initialUrl: 'https://[HOST]?app=TRUE&app_version=2',
        javascriptMode: JavascriptMode.unrestricted,
        onWebViewCreated: (WebViewController webviewController) async {
          _webViewController = webviewController;
        },
        onPageStarted: (url) {
          _webViewController?.evaluateJavascript("""
            var handlerFlutter = function (event){
              WeebetMessage.postMessage(JSON.stringify(event.data));
            }
            window.addEventListener('message', handlerFlutter,  true);
          """);
        },
        onPageFinished: (url) {},
        javascriptChannels: <JavascriptChannel>{
          JavascriptChannel(
              name: 'WeebetMessage',
              onMessageReceived: (JavascriptMessage message) {
                this._executePostMessageAction(jsonDecode(message.message));
              })
        },
      ),
      resizeToAvoidBottomInset: false,
    );
  }
}
