import 'dart:convert';
import 'dart:typed_data';

import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
import 'package:esc_pos_utils_plus/esc_pos_utils_plus.dart';
import 'package:flutter/services.dart';
import 'package:weebet_mobile/services/storage_service.dart';
import 'package:weebet_mobile/services/utilities_service.dart';
import 'package:image/image.dart' as img;

class PrinterService {
  final StorageService _storageService = StorageService();
  final UtilitiesService _utilitiesService = UtilitiesService();

  late Map printer;
  String? printerMAC;
  String? isConnected;
  int frontVersion = 2;
  int printerRollWidth = 0;
  bool? printGraphics;

  getBluetoothDevices() async {
    await _utilitiesService.handleAndroidPermissions();
    return await BluetoothThermalPrinter.getBluetooths;
  }

  printByte(receivedBytes) async {
    List<int> bytesToPrint = [];

    printer = await _storageService.getConfiguredPrinter();
    frontVersion = await _storageService.getFrontVersion() ?? 2;



    printerMAC = printer['printerMAC'];
    printerRollWidth = printer['printerRollWidth'];
    printGraphics = printer['printGraphics'];

    print("on print front version is: $frontVersion");
    print("on print printGraphics is: $printGraphics");

    if (printGraphics == true && frontVersion >= 3) {
      bytesToPrint += await _getLogoBytes();
    }

    bytesToPrint += receivedBytes;

    if (printerMAC != null) {
      isConnected = await BluetoothThermalPrinter.connectionStatus;

      if (isConnected == "true") {
        await BluetoothThermalPrinter.writeBytes(bytesToPrint);
      } else {
        String? connected = await BluetoothThermalPrinter.connect(printerMAC!);

        if (connected == "true") {
          await BluetoothThermalPrinter.writeBytes(bytesToPrint);
        } else {
          return 'print_failed';
        }
      }
    } else {
      return 'no_print_configured';
    }

    return 'success';
  }

  _getLogoBytes() async {
    List<int> imageBytes = [];
    CapabilityProfile profile = await CapabilityProfile.load();
    var paperSize = (printerRollWidth == 58 || printerRollWidth == 0)
        ? PaperSize.mm58
        : PaperSize.mm80;

    final generator = Generator(paperSize, profile);

    final Uint8List imgBytes = base64Decode(await _storageService.getLogoBase64());
    final img.Image imageToPrint = img.decodeImage(imgBytes)!;
    imageBytes += generator.image(imageToPrint);

    return imageBytes;
  }
}
