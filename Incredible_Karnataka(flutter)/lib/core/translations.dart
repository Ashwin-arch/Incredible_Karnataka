import 'package:flutter/material.dart';

class TranslationProvider extends ChangeNotifier {
  String _currentLang = 'en';
  String get currentLang => _currentLang;

  void setLang(String lang) {
    if (['en', 'hi', 'kn'].contains(lang)) {
      _currentLang = lang;
      notifyListeners();
    }
  }

  String translate(String key) {
    return _translations[_currentLang]?[key] ?? _translations['en']?[key] ?? key;
  }

  static const Map<String, Map<String, String>> _translations = {
    'en': {
      'incredible': 'Incredible',
      'karnataka': 'Karnataka',
      'splashTagline': 'Discover · Explore · Experience',
      'explore': 'Explore',
      'discover': 'Discover',
      'aiPlan': 'AI Plan',
      'saved': 'Saved',
      'profile': 'Profile',
      'discoverKarnataka': 'Discover Karnataka',
      'searchPlaceholder': 'Search places, food, experiences...',
      'interactiveMap': 'Interactive Map',
      'nearbyDiscoveries': 'Nearby Discoveries',
      'seeAll': 'See all',
      'hiddenGems': 'Hidden Gems',
      'artisanCrafts': 'Artisan Crafts',
      'language': 'Language',
      'chooseLanguage': 'Choose Language',
    },
    'hi': {
      'incredible': 'अतुल्य',
      'karnataka': 'कर्नाटक',
      'splashTagline': 'खोजें · देखें · अनुभव करें',
      'explore': 'अन्वेषण',
      'discover': 'खोजें',
      'aiPlan': 'AI योजना',
      'saved': 'सहेजा गया',
      'profile': 'प्रोफ़ाइल',
      'discoverKarnataka': 'कर्नाटक खोजें',
      'searchPlaceholder': 'स्थान, भोजन, अनुभव खोजें...',
      'interactiveMap': 'इंटरेक्टिव मैप',
      'nearbyDiscoveries': 'आस-पास की खोजें',
      'seeAll': 'सभी देखें',
      'hiddenGems': 'छिपे हुए रत्न',
      'artisanCrafts': 'कारीगरी शिल्प',
      'language': 'भाषा',
      'chooseLanguage': 'भाषा चुनें',
    },
    'kn': {
      'incredible': 'ಅದ್ಭುತ',
      'karnataka': 'ಕರ್ನಾಟಕ',
      'splashTagline': 'ಅನ್ವೇಷಿಸಿ · ಪರಿಶೋಧಿಸಿ · ಅನುಭವಿಸಿ',
      'explore': 'ಅನ್ವೇಷಿಸಿ',
      'discover': 'ಹುಡುಕಿ',
      'aiPlan': 'AI ಯೋಜನೆ',
      'saved': 'ಉಳಿಸಲಾಗಿದೆ',
      'profile': 'ಪ್ರೊಫೈಲ್',
      'discoverKarnataka': 'ಕರ್ನಾಟಕ ಅನ್ವೇಷಿಸಿ',
      'searchPlaceholder': 'ಸ್ಥಳಗಳು, ಆಹಾರ, ಅನುಭವಗಳನ್ನು ಹುಡುಕಿ...',
      'interactiveMap': 'ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
      'nearbyDiscoveries': 'ಹತ್ತಿರದ ಆವಿಷ್ಕಾರಗಳು',
      'seeAll': 'ಎಲ್ಲಾ ನೋಡಿ',
      'hiddenGems': 'ಅಡಗಿರುವ ರತ್ನಗಳು',
      'artisanCrafts': 'ಕುಶಲಕರ್ಮಿ ಕಲೆಗಳು',
      'language': 'ಭಾಷೆ',
      'chooseLanguage': 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    },
  };
}
