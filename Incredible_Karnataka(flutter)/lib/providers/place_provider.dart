import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import '../models/place.dart';

class PlaceProvider extends ChangeNotifier {
  List<Place> _places = [];
  List<Place> get places => _places;

  final Set<int> _savedIds = {};

  PlaceProvider() {
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    // 1. Initial Main Places (Hardcoded for immediate UI)
    _places = [
      Place(
        id: 1,
        name: "MTR – Mavalli Tiffin Rooms",
        category: "food",
        location: "Lalbagh Rd, Bengaluru",
        distance: "0.8 km",
        rating: 4.8,
        authenticity: 96,
        popularity: 94,
        description: "Since 1924, MTR has been serving legendary South Indian breakfasts. A 100-year tradition of pure vegetarian Karnataka cuisine that has fed generations.",
        tags: ["Heritage", "Vegetarian", "Breakfast"],
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600",
      ),
      Place(
        id: 2,
        name: "Channapatna Toy Village",
        category: "handicrafts",
        location: "Channapatna, Ramanagara",
        distance: "58 km",
        rating: 4.6,
        authenticity: 98,
        popularity: 82,
        description: "GI-tagged wooden toys crafted using centuries-old techniques. Artisan families pass down this craft, creating vibrant lacquerware pieces unique to Karnataka.",
        tags: ["GI Tag", "Artisan", "Heritage Craft"],
        imageUrl: "https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?q=80&w=600",
      ),
      Place(
        id: 3,
        name: "Hampi Ruins & Virupaksha Temple",
        category: "tourist",
        location: "Hampi, Ballari District",
        distance: "340 km",
        rating: 4.9,
        authenticity: 99,
        popularity: 97,
        description: "UNESCO World Heritage Site. The ruins of the Vijayanagara Empire spread across 26 sq km of otherworldly boulder landscapes. A photographer's paradise.",
        tags: ["UNESCO", "Ancient", "Must Visit"],
        imageUrl: "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?q=80&w=600",
      ),
    ];
    notifyListeners();

    // 2. Load Full Hidden Gems from JSON
    try {
      final String response = await rootBundle.loadString('assets/hidden_places.json');
      final data = json.decode(response);
      if (data['features'] != null) {
        final List<Place> loadedGems = [];
        for (var feature in data['features']) {
          loadedGems.add(Place.fromJson(feature));
        }
        _places = [..._places, ...loadedGems];
        notifyListeners();
      }
    } catch (e) {
      debugPrint("Error loading hidden gems JSON: $e");
    }
  }

  void toggleSave(int id) {
    if (_savedIds.contains(id)) {
      _savedIds.remove(id);
    } else {
      _savedIds.add(id);
    }
    notifyListeners();
  }

  bool isSaved(int id) => _savedIds.contains(id);
  
  List<Place> get savedPlaces => _places.where((p) => _savedIds.contains(p.id)).toList();
}
