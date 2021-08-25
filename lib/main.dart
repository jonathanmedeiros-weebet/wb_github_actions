import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart' as syspaths;
import 'dart:io';
import 'package:flutter_bluetooth_serial/flutter_bluetooth_serial.dart';

import 'DiscoveryPage.dart';

void main() {
  runApp(MyApp());
}

BluetoothDevice? defaultDevice;

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blueGrey,
      ),
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
            console.log(JSON.stringify(event.data));
            WeebetMessage.postMessage(JSON.stringify(event.data));
          });
          """);
        },
        javascriptChannels: <JavascriptChannel>{
          JavascriptChannel(
              name: 'WeebetMessage',
              onMessageReceived: (JavascriptMessage message) {
                print(message);
                var weebetMessage = json.decode(message.message);

                switch (weebetMessage['action']) {
                  case 'listPrinters':
                    print('Listar Impressoras');
                    Navigator.of(context).push(
                      MaterialPageRoute(
                          builder: (context) => BluetoothSettings()),
                    );
                    break;
                  case 'shareURL':
                    print('Compartilhamento');
                    _shareTicket(weebetMessage);
                    break;
                  case 'externalURL':
                    print('externalURL');
                    break;
                  default:
                    print('default');
                }
              })
        },
      ),
    );
  }
}

class EmptyAppBar extends StatelessWidget implements PreferredSizeWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
    );
  }

  @override
  Size get preferredSize => Size(0.0, 0.0);
}

class BluetoothSettings extends StatefulWidget {
  @override
  _BluetoothSettingsState createState() => _BluetoothSettingsState();
}

class _BluetoothSettingsState extends State<BluetoothSettings> {
  BluetoothState _bluetoothState = BluetoothState.UNKNOWN;

  String _address = "...";
  String _name = "...";

  Timer? _discoverableTimeoutTimer;
  int _discoverableTimeoutSecondsLeft = 0;
  bool _autoAcceptPairingRequests = false;

  @override
  void initState() {
    super.initState();

    // Get current state
    FlutterBluetoothSerial.instance.state.then((state) {
      setState(() {
        _bluetoothState = state;
      });
    });

    Future.doWhile(() async {
      // Wait if adapter not enabled
      if ((await FlutterBluetoothSerial.instance.isEnabled) ?? false) {
        return false;
      }
      await Future.delayed(Duration(milliseconds: 0xDD));
      return true;
    }).then((_) {
      // Update the address field
      FlutterBluetoothSerial.instance.address.then((address) {
        setState(() {
          _address = address!;
        });
      });
    });

    FlutterBluetoothSerial.instance.name.then((name) {
      setState(() {
        _name = name!;
      });
    });

    // Listen for futher state changes
    FlutterBluetoothSerial.instance
        .onStateChanged()
        .listen((BluetoothState state) {
      setState(() {
        _bluetoothState = state;

        // Discoverable mode is disabled when Bluetooth gets disabled
        _discoverableTimeoutTimer = null;
        _discoverableTimeoutSecondsLeft = 0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Configurações de Impressora'),
      ),
      body: Container(
        child: ListView(
          children: <Widget>[
            Divider(),
            ListTile(
              title: Text('Dispositivo Selecionado'),
              subtitle: Text(defaultDevice != null
                  ? defaultDevice!.name.toString()
                  : 'Nenhum Dispositivo selecionado'),
            ),
            ListTile(
              title: ElevatedButton(
                  child: const Text('Selecionar Dispositivo Blueetooth'),
                  onPressed: () async {
                    final BluetoothDevice? selectedDevice =
                        await Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) {
                          return DiscoveryPage();
                        },
                      ),
                    );

                    if (selectedDevice != null) {
                      setState(() {
                        defaultDevice = selectedDevice;
                      });
                      print('Discovery -> selected ' + selectedDevice.address);
                    } else {
                      print('Discovery -> no device selected');
                    }
                  }),
            ),
          ],
        ),
      ),
    );
  }
}
