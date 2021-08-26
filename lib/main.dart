import 'dart:io';
import 'dart:convert';
import 'dart:typed_data';
import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart' as syspaths;

//Page imports
import 'package:weebet/pages/BluetoothSettings.dart';

//Layout Imports
import 'layout/EmptyBar.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blueGrey,
      ),
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
  WebViewController? controller;
  String? printerName;
  String? printerMAC;
  String? isConnected;

  @override
  void initState() {
    super.initState();
    this._getPrinter();
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

  _listPrinters() {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => BluetoothSettings()),
    );
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
          print('Algo deu errado');
        }
      }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: EmptyAppBar(),
      body: WebView(
        initialUrl: 'http://192.168.0.147:8080?app=TRUE&app_version=2',
        javascriptMode: JavascriptMode.unrestricted,
        onWebViewCreated: (WebViewController webviewController) async {
          controller = webviewController;
        },
        onPageFinished: (String _) async {
          controller?.evaluateJavascript("""
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
