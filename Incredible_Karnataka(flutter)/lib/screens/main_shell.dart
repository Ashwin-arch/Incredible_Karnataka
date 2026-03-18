import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../core/translations.dart';
import 'explore_screen.dart';
import 'hidden_gems_screen.dart';
import 'ai_pan_screen.dart';
import 'saved_screen.dart';
import 'profile_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const ExploreScreen(),
    const HiddenGemsScreen(),
    const AIPanScreen(),
    const SavedScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final tp = Provider.of<TranslationProvider>(context);
    
    return Scaffold(
      extendBody: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: AppColors.gradBg,
        ),
        child: _screens[_currentIndex],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.bg.withAlpha((0.95 * 255).toInt()),
          border: Border(
            top: BorderSide(
              color: AppColors.orange.withAlpha((0.2 * 255).toInt()),
              width: 1,
            ),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: AppColors.yellow,
          unselectedItemColor: AppColors.muted,
          selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(fontSize: 10),
          items: [
            BottomNavigationBarItem(
              icon: const Icon(LucideIcons.map),
              label: tp.translate('explore'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(LucideIcons.sparkles),
              label: tp.translate('hiddenGems'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(LucideIcons.bot),
              label: tp.translate('aiPlan'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(LucideIcons.bookmark),
              label: tp.translate('saved'),
            ),
            BottomNavigationBarItem(
              icon: const Icon(LucideIcons.user),
              label: tp.translate('profile'),
            ),
          ],
        ),
      ),
    );
  }
}
