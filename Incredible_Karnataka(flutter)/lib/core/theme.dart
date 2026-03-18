import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color bg = Color(0xFF0D0618);
  static const Color bgDeep = Color(0xFF05020A);
  static const Color red = Color(0xFFD91B23);
  static const Color yellow = Color(0xFFFFCD00);
  static const Color orange = Color(0xFFF58220);
  static const Color blue = Color(0xFF1E40AF);
  static const Color violet = Color(0xFF6D28D9);
  static const Color skin = Color(0xFFF5CBA7);
  static const Color purple1 = Color(0xFF804A8A);
  static const Color purple2 = Color(0xFF3A0353);
  
  static const Color text = Color(0xFFF8F2E6);
  static const Color muted = Color(0xFFB89EC4);
  static const Color white = Color(0xFFFFFFFF);
  
  static const Color surface = Color(0x1A6D28D9); // Mysore Violet based surface
  static const Color glass = Color(0x1AF58220);   // Orange glass
  static const Color card = Color(0xCC140A1E);    // 0.8 opacity

  static const LinearGradient gradCultural = LinearGradient(
    colors: [red, orange, yellow],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient gradBg = LinearGradient(
    colors: [Color(0xFF1A0A2E), Color(0xFF0D0618), Color(0xFF05020A)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    stops: [0.0, 0.4, 1.0],
  );

  static const LinearGradient gradGold = LinearGradient(
    colors: [yellow, orange],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.bg,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.orange,
        secondary: AppColors.yellow,
        surface: AppColors.bgDeep,
        onSurface: AppColors.text,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: GoogleFonts.inter(
          color: AppColors.text,
          fontWeight: FontWeight.w900,
          letterSpacing: -1,
        ),
        titleLarge: GoogleFonts.inter(
          color: AppColors.text,
          fontWeight: FontWeight.w800,
          fontSize: 24,
        ),
        bodyLarge: GoogleFonts.inter(
          color: AppColors.text,
          fontSize: 16,
        ),
        bodyMedium: GoogleFonts.inter(
          color: AppColors.muted,
          fontSize: 14,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w900,
          color: AppColors.text,
        ),
      ),
    );
  }
}
