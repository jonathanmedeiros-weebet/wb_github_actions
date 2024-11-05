import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:weebet_mobile/pages/printer_settings_page.dart';
import 'package:weebet_mobile/services/printer_service.dart';
import 'package:weebet_mobile/services/utilities_service.dart';

import 'package:weebet_mobile/utils/empty_app_bar.dart';

import 'package:weebet_mobile/services/storage_service.dart';

class HomePage extends StatefulWidget {
  final String host;
  final String title;
  final int bgColor;
  final String name;
  final String slug;
  final String centralUrl;

  const HomePage(
      {super.key,
      required this.title,
      required this.host,
      required this.name,
      required this.slug,
      required this.centralUrl,
      required this.bgColor});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final StorageService _storageService = StorageService();
  final PrinterService _printerService = PrinterService();
  final UtilitiesService _utilitiesService = UtilitiesService();

  late final WebViewController _webViewController;

  String? printerName;
  String? printerMAC;
  int printerRollWidth = 58;
  bool printGraphics = true;
  String? isConnected;
  late Map printer;

  @override
  void initState() {
    super.initState();

    const params = PlatformWebViewControllerCreationParams();

    final WebViewController webViewController =
        WebViewController.fromPlatformCreationParams(params);

    webViewController
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse('${widget.host}?host=${widget.centralUrl}&name=${widget.name}&slug=${widget.slug}'))
      ..setNavigationDelegate(NavigationDelegate(
        onNavigationRequest: (NavigationRequest request) {
          final sanitizedHost =
              widget.host.replaceAll(RegExp('^(?:https?://)'), '');
          if (request.url.startsWith('http://$sanitizedHost') ||
              request.url.startsWith('https://$sanitizedHost')) {
            return NavigationDecision.navigate;
          } else {
            _utilitiesService.launchInBrowser(request.url);
            return NavigationDecision.prevent;
          }
        },
      ))
      ..addJavaScriptChannel('WeebetMessage',
          onMessageReceived: (JavaScriptMessage weebetMessage) {
        _executePostMessageAction(jsonDecode(weebetMessage.message));
      })
      ..enableZoom(false)
      ..setBackgroundColor(Color(widget.bgColor));

    _webViewController = webViewController;

    _saveLogoBytes(widget.slug);
    _getConfiguredPrinter();
    _sendApkVersion();
    _sendRollWidth(printerRollWidth);
    _sendPrintGraphics(printGraphics);
  }

  @override
  Widget build(BuildContext context) {
    FlutterNativeSplash.remove();
    return Scaffold(
      backgroundColor: Color(widget.bgColor),
      appBar: const EmptyAppBar(),
      body: WebViewWidget(controller: _webViewController),
    );
  }

  _executePostMessageAction(postMessage) async {
    switch (postMessage['action']) {
      case 'listPrinters':
        {
          _openPrinterSettings();
        }
        break;
      case 'shareURL':
        {
          _sendExecutionInfo(true);
          await _utilitiesService.shareTicket(postMessage);
          _sendExecutionInfo(false);
        }
        break;
      case 'externalURL':
        {
          _sendExecutionInfo(true);
          if (!_utilitiesService.launchInBrowser(postMessage['data'])) {
            _utilitiesService.shareTicket(postMessage);
          }
          _sendExecutionInfo(false);
        }
        break;
      case 'printLottery':
        {
          List<int> bytesToPrint = List<int>.from(postMessage['data']);
          await _printBytes(bytesToPrint);
        }
        break;
      case 'frontVersion':
        {
          await _setFrontVersion(postMessage['data']);
          break;
        }
      case 'getApkConfigs':
        {
          await _sendApkConfigs();
          break;
        }
      default:
        {
          List<int> bytesToPrint = List<int>.from(postMessage['data']);
          await _printBytes(bytesToPrint);
        }
        break;
    }
  }

  _saveLogoBytes(slug) async {
    final logoUrl =
        'https://weebet.s3.amazonaws.com/$slug/logos/logo_impressao.png';
    Uint8List remoteLogoBytes =
        (await NetworkAssetBundle(Uri.parse(logoUrl)).load(logoUrl))
            .buffer
            .asUint8List();

    await _storageService.saveLogoBase64(base64.encode(remoteLogoBytes));
  }

  _printBytes(bytesToPrint) async {
    _sendExecutionInfo(true);
    String? result = await _printerService.printByte(bytesToPrint);

    if (result == 'print_failed') {
      _printFailedDialog();
    }
    if (result == 'no_print_configured') {
      _noPrinterConfiguredDialog();
    }
    _sendExecutionInfo(false);
  }

  _sendApkVersion() {
    _webViewController.runJavaScript(
        'window.postMessage({action: "apkVersion", "version": 3}, "*");');
  }

  _sendRollWidth(int rollWidth) {
    _webViewController.runJavaScript(
        'window.postMessage({action: "printerWidth", "width": $rollWidth}, "*");');
  }

  _sendPrintGraphics(bool printGraphics) {
    _webViewController.runJavaScript(
        'window.postMessage({action: "printGraphics", "print_graphics": $printGraphics}, "*");');
  }

  _sendExecutionInfo(bool executionInfo) {
    _webViewController.runJavaScript(
        'window.postMessage({action: "executionInfo", "executing": $executionInfo}, "*");');
  }

  _getConfiguredPrinter() async {
    printer = await _storageService.getConfiguredPrinter();

    setState(() {
      printerName = printer['printerName'];
      printerMAC = printer['printerMAC'];
      printerRollWidth = printer['printerRollWidth'];
      printGraphics = printer['printGraphics'];
    });
  }

  _openPrinterSettings() async {
    _utilitiesService.handleAndroidPermissions();
    await Navigator.of(context).push(
        MaterialPageRoute(builder: (context) => const PrinterSettingsPage()));

    await _sendApkConfigs();
  }

  _sendApkConfigs() async {
    await _getConfiguredPrinter();
    await _sendRollWidth(printerRollWidth);
    await _sendPrintGraphics(printGraphics);
    await _sendApkVersion();
  }

  _setFrontVersion(version) async {
    await _storageService.setFrontVersion(version);
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
              _openPrinterSettings();
            },
            child: const Text('Configurar Impressora'),
          ),
        ],
      ),
    );
  }
}
