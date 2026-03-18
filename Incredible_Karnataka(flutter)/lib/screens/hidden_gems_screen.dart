import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../providers/place_provider.dart';
import '../models/place.dart';
import 'package:google_fonts/google_fonts.dart';

class HiddenGemsScreen extends StatefulWidget {
  const HiddenGemsScreen({super.key});

  @override
  State<HiddenGemsScreen> createState() => _HiddenGemsScreenState();
}

class _HiddenGemsScreenState extends State<HiddenGemsScreen> {
  final MapController _mapController = MapController();
  final Set<String> _selectedCategories = {};
  List<dynamic>? _karnatakaBoundary;

  @override
  void initState() {
    super.initState();
    _loadBoundary();
  }

  Future<void> _loadBoundary() async {
    try {
      final String response = await rootBundle.loadString('assets/karnataka_boundary.json');
      final data = json.decode(response);
      setState(() {
        _karnatakaBoundary = data['features'];
      });
    } catch (e) {
      debugPrint("Error loading boundary: $e");
    }
  }

  void _onToggleCategory(String category) {
    setState(() {
      if (_selectedCategories.contains(category)) {
        if (_selectedCategories.length > 1) {
          _selectedCategories.remove(category);
        }
      } else {
        _selectedCategories.add(category);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final placeProvider = context.watch<PlaceProvider>();
    final allPlaces = placeProvider.places.where((p) => p.latitude != null).toList();
    
    // Get unique categories and their counts
    final Map<String, int> categories = {};
    for (var p in allPlaces) {
      categories[p.category] = (categories[p.category] ?? 0) + 1;
    }

    // Initialize selected categories if empty
    if (_selectedCategories.isEmpty && categories.isNotEmpty) {
      _selectedCategories.addAll(categories.keys);
    }

    final visiblePlaces = allPlaces.where((p) => _selectedCategories.contains(p.category)).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      extendBodyBehindAppBar: true,
      drawer: _buildSidebar(categories, allPlaces.length, visiblePlaces.length),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Builder(
          builder: (context) => IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: const Icon(LucideIcons.menu, color: Colors.white, size: 20),
            ),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        title: Text(
          "HIDDEN GEMS",
          style: GoogleFonts.outfit(
            color: Colors.white,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
            fontSize: 16,
          ),
        ),
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: const LatLng(15.3173, 75.7139), // Center of Karnataka
              initialZoom: 7,
              minZoom: 6,
              maxZoom: 18,

            ),
            children: [
              TileLayer(
                urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                subdomains: const ['a', 'b', 'c', 'd'],
                userAgentPackageName: 'com.incrediblekarnataka.karnataka_tourism',
              ),
              if (_karnatakaBoundary != null)
                PolylineLayer(
                  polylines: [
                    for (var feature in _karnatakaBoundary!)
                      if (feature['geometry']['type'] == 'Polygon')
                        Polyline(
                          points: (feature['geometry']['coordinates'][0] as List)
                              .map((coords) => LatLng(coords[1].toDouble(), coords[0].toDouble()))
                              .toList(),
                          color: const Color(0xFF38BDF8).withValues(alpha: 0.6),
                          strokeWidth: 3,
                        )
                      else if (feature['geometry']['type'] == 'MultiPolygon')
                        for (var polygon in feature['geometry']['coordinates'])
                          Polyline(
                            points: (polygon[0] as List)
                                .map((coords) => LatLng(coords[1].toDouble(), coords[0].toDouble()))
                                .toList(),
                            color: const Color(0xFF38BDF8).withValues(alpha: 0.6),
                            strokeWidth: 3,
                          ),
                  ],
                ),
              // Inner glow effect for boundary
              if (_karnatakaBoundary != null)
                PolylineLayer(
                  polylines: [
                    for (var feature in _karnatakaBoundary!)
                      if (feature['geometry']['type'] == 'Polygon')
                        Polyline(
                          points: (feature['geometry']['coordinates'][0] as List)
                              .map((coords) => LatLng(coords[1].toDouble(), coords[0].toDouble()))
                              .toList(),
                          color: const Color(0xFFBAE6FD).withValues(alpha: 0.3),
                          strokeWidth: 1,
                        )
                      else if (feature['geometry']['type'] == 'MultiPolygon')
                        for (var polygon in feature['geometry']['coordinates'])
                          Polyline(
                            points: (polygon[0] as List)
                                .map((coords) => LatLng(coords[1].toDouble(), coords[0].toDouble()))
                                .toList(),
                            color: const Color(0xFFBAE6FD).withValues(alpha: 0.3),
                            strokeWidth: 1,
                          ),
                  ],
                ),
              MarkerLayer(
                markers: visiblePlaces.map((place) => Marker(
                  point: LatLng(place.latitude!, place.longitude!),
                  width: 40,
                  height: 40,
                  child: GestureDetector(
                    onTap: () {
                      _mapController.move(LatLng(place.latitude!, place.longitude!), 10);
                      showDialog(
                        context: context,
                        builder: (ctx) => _buildPopupCard(ctx, place),
                      );
                    },
                    child: _buildMarker(place),
                  ),
                )).toList(),
              ),
            ],
          ),
          
          // Removed Bottom Sheet
        ],
      ),
    );
  }

  Widget _buildMarker(Place place) {
    Color markerColor = Colors.lightBlueAccent;
    switch (place.category.toLowerCase()) {
      case 'religious': markerColor = Colors.amber; break;
      case 'heritage': markerColor = Colors.orange; break;
      case 'nature': markerColor = Colors.green; break;
      case 'adventure': markerColor = Colors.pinkAccent; break;
    }

    return Container(
      decoration: BoxDecoration(
        color: markerColor.withValues(alpha: 0.2),
        shape: BoxShape.circle,
        border: Border.all(color: markerColor, width: 2),
      ),
      child: Center(
        child: Icon(
          _getIconForCategory(place.category),
          color: markerColor,
          size: 16,
        ),
      ),
    );
  }

  IconData _getIconForCategory(String category) {
    switch (category.toLowerCase()) {
      case 'religious': return LucideIcons.sparkles;
      case 'heritage': return LucideIcons.landmark;
      case 'nature': return LucideIcons.trees;
      case 'adventure': return LucideIcons.mountain;
      default: return LucideIcons.mapPin;
    }
  }

  Widget _buildSidebar(Map<String, int> categories, int total, int visible) {
    return Drawer(
      backgroundColor: const Color(0xFF0F172A).withValues(alpha: 0.95),
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "HIDDEN GEMS",
                    style: GoogleFonts.outfit(
                      color: Colors.white,
                      fontWeight: FontWeight.w900,
                      fontSize: 24,
                      letterSpacing: -1,
                    ),
                  ),
                  Text(
                    "INCREDIBLE KARNATAKA",
                    style: GoogleFonts.outfit(
                      color: Colors.blueGrey[400],
                      fontWeight: FontWeight.bold,
                      fontSize: 10,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Colors.greenAccent,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "$visible Destinations",
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                            ),
                            Text(
                              "of $total curated gems",
                              style: TextStyle(color: Colors.blueGrey[400], fontSize: 10),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.0),
              child: Text(
                "CATEGORIES",
                style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 2),
              ),
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: categories.entries.map((entry) {
                  final cat = entry.key;
                  final count = entry.value;
                  final isSelected = _selectedCategories.contains(cat);
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: InkWell(
                      onTap: () => _onToggleCategory(cat),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isSelected ? Colors.white.withValues(alpha: 0.1) : Colors.transparent,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? Colors.white.withValues(alpha: 0.1) : Colors.transparent,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              _getIconForCategory(cat),
                              color: isSelected ? Colors.lightBlueAccent : Colors.blueGrey[600],
                              size: 20,
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Text(
                                cat,
                                style: TextStyle(
                                  color: isSelected ? Colors.white : Colors.blueGrey[400],
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: isSelected ? Colors.lightBlueAccent.withValues(alpha: 0.2) : Colors.white.withValues(alpha: 0.05),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                count.toString(),
                                style: TextStyle(
                                  color: isSelected ? Colors.lightBlueAccent : Colors.blueGrey[500],
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCoordinates(BuildContext context, Place place) {
    if (place.latitude == null || place.longitude == null) return;
    
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('GPS Coordinates', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Navigate to this exact location using:', style: GoogleFonts.outfit(color: Colors.white70)),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black26,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white10),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.mapPin, color: Color(0xFFF58220), size: 20),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      '${place.latitude!.toStringAsFixed(6)}, ${place.longitude!.toStringAsFixed(6)}',
                      style: GoogleFonts.outfit(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text('Close', style: GoogleFonts.outfit(color: const Color(0xFFB89EC4))),
          ),
        ],
      ),
    );
  }

  Widget _buildPopupCard(BuildContext context, Place place) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400, maxHeight: 600),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white10),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.5),
              blurRadius: 30,
              offset: const Offset(0, 10),
            )
          ]
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header Image
            if (place.imageUrl != null)
               ClipRRect(
                 borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                 child: Image.asset(
                   'assets${place.imageUrl}', // e.g., assets/images/places/papnash_temple.jpg
                   height: 180,
                   width: double.infinity,
                   fit: BoxFit.cover,
                   errorBuilder: (context, error, stackTrace) => Container(
                     height: 180,
                     decoration: const BoxDecoration(
                       borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                       gradient: LinearGradient(
                         colors: [Color(0xFF804A8A), Color(0xFF3A0353)],
                       ),
                     ),
                     child: const Center(child: Icon(LucideIcons.cameraOff, size: 40, color: Colors.white54)),
                   ),
                 ),
               )
            else
               Container(
                 height: 180,
                 width: double.infinity,
                 decoration: const BoxDecoration(
                   borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                   gradient: LinearGradient(
                     colors: [Color(0xFF804A8A), Color(0xFF3A0353)],
                   ),
                 ),
                 child: const Center(child: Icon(LucideIcons.cameraOff, size: 40, color: Colors.white54)),
               ),
            
            // Content
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                place.name,
                                style: GoogleFonts.outfit(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.w900,
                                  height: 1.1,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  const Icon(LucideIcons.mapPin, size: 12, color: Colors.lightBlueAccent),
                                  const SizedBox(width: 4),
                                  Text(
                                    place.district ?? place.location,
                                    style: TextStyle(color: Colors.blueGrey[400], fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        StatefulBuilder(
                          builder: (context, setStateLocal) {
                            final isSaved = context.watch<PlaceProvider>().isSaved(place.id ?? 0);
                            return IconButton(
                              icon: Icon(
                                LucideIcons.bookmark,
                                color: isSaved ? Colors.lightBlueAccent : Colors.blueGrey[400],
                              ),
                              onPressed: () {
                                context.read<PlaceProvider>().toggleSave(place.id ?? 0);
                              },
                            );
                          }
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    if (place.detailedDescription != null || place.description.isNotEmpty)
                      Text(
                        place.detailedDescription ?? place.description,
                        style: TextStyle(color: Colors.blueGrey[300], fontSize: 14, height: 1.6),
                      ),
                    const SizedBox(height: 20),
                    if (place.highlights.isNotEmpty) ...[
                      const Text(
                        "HIGHLIGHTS",
                        style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 10, letterSpacing: 2),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: place.highlights.map((h) => Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.lightBlueAccent.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.lightBlueAccent.withValues(alpha: 0.2)),
                          ),
                          child: Text(
                            h,
                            style: const TextStyle(color: Colors.lightBlueAccent, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        )).toList(),
                      ),
                      const SizedBox(height: 20),
                    ],
                  ],
                ),
              ),
            ),
            
            // Actions
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: Colors.blueGrey),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text("Back to Map", style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => _showCoordinates(context, place),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.lightBlueAccent,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      icon: const Icon(LucideIcons.navigation2, size: 18),
                      label: Text("Directions", style: GoogleFonts.outfit(fontWeight: FontWeight.w900)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
