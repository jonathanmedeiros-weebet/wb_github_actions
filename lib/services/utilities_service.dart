import 'dart:convert';
import 'dart:typed_data';

import 'package:permission_handler/permission_handler.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher_string.dart';

class UtilitiesService {
  shareTicket(var ticket) async {
    if (ticket['file'] != null) {
      ticket['file'] = ticket['file'].replaceAll('data:image/png;base64,', '');
      Uint8List imageBytes = base64.decode(ticket['file']);

      await Share.shareXFiles([
        XFile.fromData(imageBytes, name: 'ticket.png', mimeType: 'image/png')
      ], text: ticket['message'], subject: 'Compartilhamento');
    } else {
      await Share.share(ticket['message'], subject: 'Compartilhamento');
    }
  }

  launchInBrowser(String url) async {
    if (!await launchUrlString(
      url,
      mode: LaunchMode.externalApplication,
    )) {
      return false;
    }

    return true;
  }

  handleAndroidPermissions() async {
    // Android 10-
    await Permission.bluetooth.request();

    // Android 11 +
    await Permission.bluetoothConnect.request();
    await Permission.bluetoothScan.request();
    await Permission.bluetoothAdvertise.request();
  }
}
