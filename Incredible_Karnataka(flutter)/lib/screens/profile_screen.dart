import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../core/translations.dart';
import '../widgets/glass_card.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final tp = Provider.of<TranslationProvider>(context);
    
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: [
            const SizedBox(height: 80),
            _buildProfileHeader(),
            const SizedBox(height: 32),
            _buildLanguageSection(tp, context),
            const SizedBox(height: 20),
            _buildSettingsItem(LucideIcons.bell, 'Notifications', 'Enabled'),
            _buildSettingsItem(LucideIcons.info, 'About App', ''),
            const SizedBox(height: 40),
            _buildLogoutButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Column(
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: AppColors.gradCultural,
            border: Border.all(color: AppColors.yellow, width: 2),
            boxShadow: [
              BoxShadow(
                color: AppColors.orange.withAlpha((0.3 * 255).toInt()),
                blurRadius: 20,
                spreadRadius: 5,
              ),
            ],
          ),
          child: const Center(
            child: Icon(LucideIcons.user, size: 50, color: Colors.white),
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          'Karnataka Explorer',
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.text),
        ),
        Text(
          'Since 2024',
          style: TextStyle(color: AppColors.muted, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildLanguageSection(TranslationProvider tp, BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(20),
      borderRadius: 24,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.globe, color: AppColors.orange, size: 20),
              const SizedBox(width: 12),
              Text(
                tp.translate('language'),
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.text),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildLanguageOption(tp, 'en', 'English'),
          _buildLanguageOption(tp, 'hi', 'हिंदी (Hindi)'),
          _buildLanguageOption(tp, 'kn', 'ಕನ್ನಡ (Kannada)'),
        ],
      ),
    );
  }

  Widget _buildLanguageOption(TranslationProvider tp, String code, String label) {
    final isSelected = tp.currentLang == code;
    return InkWell(
      onTap: () => tp.setLang(code),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: TextStyle(color: isSelected ? AppColors.yellow : AppColors.text, fontSize: 15)),
            if (isSelected) const Icon(LucideIcons.checkCircle, color: AppColors.yellow, size: 18),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsItem(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassCard(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        borderRadius: 20,
        child: Row(
          children: [
            Icon(icon, color: AppColors.violet, size: 20),
            const SizedBox(width: 16),
            Expanded(
              child: Text(title, style: const TextStyle(color: AppColors.text, fontSize: 15)),
            ),
            if (value.isNotEmpty)
              Text(value, style: TextStyle(color: AppColors.muted, fontSize: 14)),
            const Icon(LucideIcons.chevronRight, color: AppColors.muted, size: 18),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return Container(
      width: double.infinity,
      height: 56,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.red.withAlpha((0.5 * 255).toInt())),
      ),
      child: Center(
        child: Text(
          'Log Out',
          style: TextStyle(color: AppColors.red.withAlpha((0.8 * 255).toInt()), fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
