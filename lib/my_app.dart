import 'package:flutter/material.dart';

import 'package:weebet_mobile/pages/home_page.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'APP BET4',
      color: const Color(0xFF000000),
      home: const HomePage(
        title: 'APP BET4',
        host: 'https://app.weebet.tech',
        slug: 'bet4.wee.bet',
        name: 'APP BET4',
        centralUrl: 'https://central.bet4.wee.bet',
        bgColor: 0xFF000000,
      ),
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      darkTheme: ThemeData.dark(),
    );
  }
}
