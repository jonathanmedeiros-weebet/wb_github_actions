import 'package:bluetooth_thermal_printer/bluetooth_thermal_printer.dart';
import 'package:weebet_mobile/services/storage_service.dart';
import 'package:weebet_mobile/services/utilities_service.dart';

class PrinterService {
  final StorageService _storageService = StorageService();
  final UtilitiesService _utilitiesService = UtilitiesService();

  late Map printer;
  String? printerMAC;
  String? isConnected;

  getBluetoothDevices() async {
    await _utilitiesService.handleAndroidPermissions();
    return await BluetoothThermalPrinter.getBluetooths;
  }

  printByte(bytes) async {
    printer = await _storageService.getConfiguredPrinter();
    printerMAC = printer['printerMAC'];

    if (printerMAC != null) {
      isConnected = await BluetoothThermalPrinter.connectionStatus;

      if (isConnected == "true") {
        await BluetoothThermalPrinter.writeBytes(bytes);
      } else {
        String? connected = await BluetoothThermalPrinter.connect(printerMAC!);

        if (connected == "true") {
          await BluetoothThermalPrinter.writeBytes(bytes);
        } else {
          return 'print_failed';
        }
      }
    } else {
      return 'no_print_configured';
    }

    return 'success';
  }
}
