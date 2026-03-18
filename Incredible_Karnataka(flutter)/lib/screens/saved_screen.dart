import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../core/translations.dart';
import '../providers/place_provider.dart';
import '../widgets/glass_card.dart';
import '../models/place.dart';

class SavedScreen extends StatelessWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final tp = Provider.of<TranslationProvider>(context);
    final pp = Provider.of<PlaceProvider>(context);
    final savedPlaces = pp.savedPlaces;

    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: const Text('Saved Places'),
      ),
      body: savedPlaces.isEmpty
          ? _buildEmptyState(tp)
          : ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              itemCount: savedPlaces.length,
              itemBuilder: (context, index) {
                final place = savedPlaces[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildPlaceCard(place, pp),
                );
              },
            ),
    );
  }

  Widget _buildEmptyState(TranslationProvider tp) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(LucideIcons.bookmark, size: 64, color: AppColors.muted),
          const SizedBox(height: 16),
          const Text(
            'Nothing saved yet',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.text),
          ),
          const SizedBox(height: 8),
          Text(
            'Bookmark places you love to find them here',
            style: TextStyle(color: AppColors.muted, fontSize: 14),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceCard(Place place, PlaceProvider pp) {
    return GlassCard(
      padding: const EdgeInsets.all(12),
      borderRadius: 20,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      place.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      place.location,
                      style: TextStyle(color: AppColors.muted, fontSize: 13),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(LucideIcons.bookmark, color: AppColors.yellow, size: 20),
                onPressed: () => pp.toggleSave(place.id ?? 0),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            place.description,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(color: AppColors.muted, fontSize: 13, height: 1.4),
          ),
        ],
      ),
    );
  }
}
