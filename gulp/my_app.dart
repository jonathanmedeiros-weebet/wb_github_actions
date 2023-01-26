import 'package:flutter/material.dart';

import 'package:weebet_mobile/pages/home_page.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '[NOME_BANCA]',
      home: const HomePage(
        title: '[NOME_BANCA]',
        host: '[HOST]',
      ),
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      darkTheme: ThemeData.dark(),
    );
  }
}
