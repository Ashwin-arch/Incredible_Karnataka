import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/theme.dart';
import '../core/translations.dart';
import '../providers/place_provider.dart';
import '../widgets/glass_card.dart';
import '../models/place.dart';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  String selectedCategory = 'all';

  @override
  Widget build(BuildContext context) {
    final tp = Provider.of<TranslationProvider>(context);
    final pp = Provider.of<PlaceProvider>(context);
    
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: CustomScrollView(
        slivers: [
          _buildHeader(tp),
          _buildSearchBar(tp),
          _buildCategories(tp),
          _buildPlaceList(pp, tp),
        ],
      ),
    );
  }

  Widget _buildHeader(TranslationProvider tp) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 60, 20, 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(LucideIcons.mapPin, color: AppColors.orange, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      'Bengaluru, Karnataka',
                      style: TextStyle(color: AppColors.muted, fontSize: 12),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  tp.translate('discoverKarnataka'),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: AppColors.text,
                  ),
                ),
              ],
            ),
            GlassCard(
              padding: const EdgeInsets.all(10),
              borderRadius: 12,
              child: const Icon(LucideIcons.bell, color: AppColors.text, size: 20),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar(TranslationProvider tp) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: GlassCard(
          borderRadius: 14,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: TextField(
            style: const TextStyle(color: AppColors.text),
            decoration: InputDecoration(
              hintText: tp.translate('searchPlaceholder'),
              hintStyle: TextStyle(color: AppColors.muted, fontSize: 14),
              icon: const Icon(LucideIcons.search, color: AppColors.muted, size: 18),
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              filled: false,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCategories(TranslationProvider tp) {
    final categories = [
      {'id': 'all', 'label': 'All', 'icon': LucideIcons.compass},
      {'id': 'food', 'label': 'Food', 'icon': LucideIcons.utensilsCrossed},
      {'id': 'handicrafts', 'label': 'Crafts', 'icon': LucideIcons.gem},
      {'id': 'shops', 'label': 'Shops', 'icon': LucideIcons.shoppingBag},
      {'id': 'tourist', 'label': 'Tourist', 'icon': LucideIcons.landmark},
      {'id': 'stays', 'label': 'Stays', 'icon': LucideIcons.bed},
    ];

    return SliverToBoxAdapter(
      child: Container(
        height: 60,
        margin: const EdgeInsets.symmetric(vertical: 20),
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: categories.length,
          itemBuilder: (context, index) {
            final cat = categories[index];
            final isSelected = selectedCategory == cat['id'];
            
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: GlassCard(
                onTap: () => setState(() => selectedCategory = cat['id'] as String),
                borderRadius: 12,
                borderColor: isSelected ? AppColors.orange : null,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    Icon(
                      cat['icon'] as IconData,
                      color: isSelected ? AppColors.orange : AppColors.muted,
                      size: 16,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      cat['label'] as String,
                      style: TextStyle(
                        color: isSelected ? AppColors.text : AppColors.muted,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildPlaceList(PlaceProvider pp, TranslationProvider tp) {
    final filteredPlaces = selectedCategory == 'all'
        ? pp.places
        : pp.places.where((p) => p.category.toLowerCase() == selectedCategory.toLowerCase()).toList();

    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final place = filteredPlaces[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: _buildPlaceCard(place, pp),
            );
          },
          childCount: filteredPlaces.length,
        ),
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
              Column(
                children: [
                  IconButton(
                    icon: Icon(
                      pp.isSaved(place.id ?? 0) ? LucideIcons.bookmark : LucideIcons.bookmark,
                      color: pp.isSaved(place.id ?? 0) ? AppColors.yellow : AppColors.muted,
                      size: 20,
                    ),
                    onPressed: () => pp.toggleSave(place.id ?? 0),
                  ),
                ],
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
          const SizedBox(height: 16),
          _buildStatsRow(place),
        ],
      ),
    );
  }

  Widget _buildStatsRow(Place place) {
    return Row(
      children: [
        if (place.rating != null) ...[
          const Icon(LucideIcons.star, color: AppColors.yellow, size: 14),
          const SizedBox(width: 4),
          Text(
            place.rating.toString(),
            style: const TextStyle(color: AppColors.text, fontSize: 12, fontWeight: FontWeight.bold),
          ),
          const SizedBox(width: 16),
        ],
        const Spacer(),
        const Icon(LucideIcons.mapPin, color: AppColors.orange, size: 14),
        const SizedBox(width: 4),
        Text(
          place.location,
          style: const TextStyle(color: AppColors.orange, fontSize: 12, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }
}
