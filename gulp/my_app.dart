import 'package:flutter/material.dart';

import 'package:weebet_mobile/pages/home_page.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '[NOME_BANCA]',
      color: const Color(0xFF[SPLASH_COLOR]),
      home: const HomePage(
        title: '[NOME_BANCA]',
        host: '[HOST]',
        slug: '[SLUG]',
        name: '[NOME_BANCA]',
        centralUrl: '[CENTRAL_URL]',
        bgColor: 0xFF[SPLASH_COLOR],
      ),
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      darkTheme: ThemeData.dark(),
    );
  }
}
