import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme.dart';
import 'core/translations.dart';
import 'providers/place_provider.dart';

import 'screens/splash_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TranslationProvider()),
        ChangeNotifierProvider(create: (_) => PlaceProvider()),
      ],
      child: const IncredibleKarnatakaApp(),
    ),
  );
}

class IncredibleKarnatakaApp extends StatelessWidget {
  const IncredibleKarnatakaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Incredible Karnataka',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const SplashScreen(),
    );
  }
}
