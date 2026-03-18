class Place {
  final int? id;
  final String name;
  final String category;
  final String location;
  final String? district;
  final String? distance;
  final double? rating;
  final int? authenticity;
  final int? popularity;
  final String description;
  final String? detailedDescription;
  final List<String> tags;
  final List<String> highlights;
  final List<String> nearbyAttractions;
  final String? imageUrl;
  final String? googleMapsLink;
  final String? tourismType;
  final double? latitude;
  final double? longitude;

  Place({
    this.id,
    required this.name,
    required this.category,
    required this.location,
    this.district,
    this.distance,
    this.rating,
    this.authenticity,
    this.popularity,
    required this.description,
    this.detailedDescription,
    this.tags = const [],
    this.highlights = const [],
    this.nearbyAttractions = const [],
    this.imageUrl,
    this.googleMapsLink,
    this.tourismType,
    this.latitude,
    this.longitude,
  });

  factory Place.fromJson(Map<String, dynamic> json) {
    // Handle both formats (Main PLACES and GeoJSON Features)
    final props = json['properties'] ?? json;
    final geom = json['geometry'];
    
    return Place(
      id: props['id'],
      name: props['name'],
      category: props['category'],
      location: props['location'] ?? props['district'] ?? '',
      district: props['district'],
      distance: props['distance'],
      rating: props['rating']?.toDouble(),
      authenticity: props['authenticity'],
      popularity: props['popularity'],
      description: props['description'] ?? props['desc'] ?? '',
      detailedDescription: props['detailed_description'],
      tags: List<String>.from(props['tags'] ?? []),
      highlights: List<String>.from(props['highlights'] ?? []),
      nearbyAttractions: List<String>.from(props['nearby_attractions'] ?? []),
      imageUrl: props['image_url'],
      googleMapsLink: props['google_maps_link'],
      tourismType: props['tourism_type'],
      latitude: geom != null ? geom['coordinates'][1].toDouble() : null,
      longitude: geom != null ? geom['coordinates'][0].toDouble() : null,
    );
  }
}
