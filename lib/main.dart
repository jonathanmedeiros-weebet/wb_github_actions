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

//Page imports
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
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      darkTheme: ThemeData.dark(),
      home: MyHomePage(title: 'Weebet Demo'),
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
      default:
        {
          List<int> bytesToPrint = List<int>.from(postMessage['data']);
          this._printByte(bytesToPrint);
          print('default switch');
        }
        break;
    }
  }

  _listPrinters() async {
    int? rollWidthReceived = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => BluetoothSettings()),
    );
    this._sendRollWidth(rollWidthReceived);
  }

  _printByte(bytes) async {
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
          AlertDialog(
            title: Text('Algo deu errado'),
          );
        }
      }
    } else {
      AlertDialog(
        title: Text('Nenhuma Impressora configurada'),
      );
    }
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
    console.log('a ação foi executada');
    parent.postMessage({action: 'printerWidth', width: $rollWidth}, '*');
    """);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: EmptyAppBar(),
      body: WebView(
        initialUrl: 'http://192.168.5.5:8080?app=TRUE&app_version=2',
        javascriptMode: JavascriptMode.unrestricted,
        onWebViewCreated: (WebViewController webviewController) async {
          _webViewController = webviewController;
        },
        onPageFinished: (String _) async {
          _webViewController?.evaluateJavascript("""
          window.addEventListener('message', (event) => {
              WeebetMessage.postMessage(JSON.stringify(event.data));
          });
          """);
        },
        javascriptChannels: <JavascriptChannel>{
          JavascriptChannel(
              name: 'WeebetMessage',
              onMessageReceived: (JavascriptMessage message) {
                var weebetMessage = jsonDecode(message.message);
                this._executePostMessageAction(weebetMessage);
              })
        },
      ),
    );
  }
}
