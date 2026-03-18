import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../core/translations.dart';
import '../widgets/glass_card.dart';

class AIPanScreen extends StatefulWidget {
  const AIPanScreen({super.key});

  @override
  State<AIPanScreen> createState() => _AIPanScreenState();
}

class _AIPanScreenState extends State<AIPanScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isGenerating = true;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();

    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _isGenerating = false);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tp = Provider.of<TranslationProvider>(context);
    
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(tp.translate('aiPlan')),
      ),
      body: _isGenerating ? _buildLoadingState(tp) : _buildItinerary(tp),
    );
  }

  Widget _buildLoadingState(TranslationProvider tp) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          RotationTransition(
            turns: _controller,
            child: const Icon(LucideIcons.sparkles, size: 64, color: AppColors.yellow),
          ),
          const SizedBox(height: 24),
          const Text(
            'Crafting your experience...',
            style: TextStyle(color: AppColors.text, fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildItinerary(TranslationProvider tp) {
    final steps = [
      {
        'title': 'Breakfast at MTR',
        'desc': "Start with Karnataka's most iconic Rava Idli and filter coffee",
        'time': '08:30 AM',
      },
      {
        'title': 'Lalbagh Botanical Garden',
        'desc': 'Morning walk through 240 acres of lush greenery and heritage glasshouse',
        'time': '10:00 AM',
      },
      {
        'title': 'Shivaji Military Hotel',
        'desc': 'Authentic Mutton Biryani and Ragi Mudde lunch experience',
        'time': '01:30 PM',
      },
      {
        'title': 'Commercial Street',
        'desc': 'Browse silk sarees, handicrafts and Karnataka specialties',
        'time': '04:00 PM',
      },
    ];

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        GlassCard(
          padding: const EdgeInsets.all(16),
          borderRadius: 20,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(LucideIcons.sparkles, color: AppColors.yellow, size: 16),
                  SizedBox(width: 8),
                  Text(
                    'AI RECOMMENDATION',
                    style: TextStyle(color: AppColors.yellow, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Text(
                'Bengaluru – 1 Day Plan',
                style: TextStyle(color: AppColors.text, fontSize: 20, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 8),
              Text(
                'Based on your interest in heritage food and local crafts.',
                style: TextStyle(color: AppColors.muted, fontSize: 14),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        ...steps.map((step) => _buildItineraryStep(step)),
      ],
    );
  }

  Widget _buildItineraryStep(Map<String, String> step) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              const CircleAvatar(radius: 6, backgroundColor: AppColors.orange),
              Container(width: 2, height: 60, color: AppColors.orange.withAlpha((0.2 * 255).toInt())),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: GlassCard(
              padding: const EdgeInsets.all(16),
              borderRadius: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(step['time']!, style: const TextStyle(color: AppColors.orange, fontSize: 12, fontWeight: FontWeight.bold)),
                      const Icon(LucideIcons.chevronRight, color: AppColors.muted, size: 14),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(step['title']!, style: const TextStyle(color: AppColors.text, fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(step['desc']!, style: TextStyle(color: AppColors.muted, fontSize: 13)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
