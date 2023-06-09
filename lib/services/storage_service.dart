import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  getConfiguredPrinter() async {
    final prefs = await SharedPreferences.getInstance();

    return {
      'printerName': prefs.getString('printer_name'),
      'printerMAC': prefs.getString('printer_mac'),
      'printerRollWidth': prefs.getInt('printer_roll_width') ?? 58,
      'printGraphics': prefs.getBool('print_graphics') ?? true
    };
  }

  setPrinter(String? name, String? mac) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('printer_name', name!);
    prefs.setString('printer_mac', mac!);
  }

  setPrinterRollWidth(int? rollWidth) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('printer_roll_width', rollWidth!);
  }

  setPrintGraphics(bool? printGraphics) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool('print_graphics', printGraphics!);
  }

  setFrontVersion(int frontVersion) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setInt('front_version', frontVersion);
  }

  getFrontVersion() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt('front_version');
  }

  saveLogoBase64(logoBytes) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('logo_base64', logoBytes);
  }

  getLogoBase64() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('logo_base64');
  }
}
