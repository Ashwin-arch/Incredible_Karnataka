import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'auth_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with TickerProviderStateMixin {
  int _slide = 0;
  late AnimationController _slideCtrl;
  late Animation<double> _iconFade;
  late Animation<double> _iconScale;
  late Animation<double> _textFade;

  final _slides = const [
    _OnboardingSlide(
      icon: LucideIcons.gem,
      title: 'Hidden Gems',
      subtitle:
          'Discover generational businesses and artisan crafts that have been passed down for centuries.',
      color: Color(0xFF804A8A),
    ),
    _OnboardingSlide(
      icon: LucideIcons.map,
      title: 'Hyperlocal Map',
      subtitle:
          'See real-time, location-aware recommendations on an interactive map. Every pin tells a unique story.',
      color: Color(0xFF4ECDC4),
    ),
    _OnboardingSlide(
      icon: LucideIcons.bot,
      title: 'AI Recommendations',
      subtitle:
          'Our AI learns your specific tastes and builds personalized itineraries for an authentic Karnataka journey.',
      color: Color(0xFFF58220),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _slideCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _iconFade = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _slideCtrl, curve: const Interval(0.0, 0.6, curve: Curves.easeOut)),
    );
    _iconScale = Tween(begin: 0.6, end: 1.0).animate(
      CurvedAnimation(parent: _slideCtrl, curve: const Interval(0.0, 0.6, curve: Curves.easeOutBack)),
    );
    _textFade = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _slideCtrl, curve: const Interval(0.3, 1.0, curve: Curves.easeOut)),
    );
    _slideCtrl.forward();
  }

  @override
  void dispose() {
    _slideCtrl.dispose();
    super.dispose();
  }

  void _goToSlide(int index) {
    _slideCtrl.reset();
    setState(() => _slide = index);
    _slideCtrl.forward();
  }

  void _next() {
    if (_slide < _slides.length - 1) {
      _goToSlide(_slide + 1);
    } else {
      _navigateToAuth();
    }
  }

  void _navigateToAuth() {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const AuthScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) =>
            FadeTransition(opacity: animation, child: child),
        transitionDuration: const Duration(milliseconds: 500),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final current = _slides[_slide];

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1A0A2E), Color(0xFF0D0618), Color(0xFF05020A)],
            stops: [0.0, 0.4, 1.0],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Top bar: Skip
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton.icon(
                      onPressed: _navigateToAuth,
                      icon: const Icon(LucideIcons.chevronRight, size: 14, color: Color(0xFFB89EC4)),
                      label: Text(
                        'Skip',
                        style: GoogleFonts.outfit(
                          color: const Color(0xFFB89EC4),
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Slide content
              Expanded(
                child: AnimatedBuilder(
                  animation: _slideCtrl,
                  builder: (context, child) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Icon glow card
                        FadeTransition(
                          opacity: _iconFade,
                          child: ScaleTransition(
                            scale: _iconScale,
                            child: Container(
                              width: 160,
                              height: 160,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(48),
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    current.color.withValues(alpha: 0.25),
                                    current.color.withValues(alpha: 0.08),
                                  ],
                                ),
                                border: Border.all(
                                  color: current.color.withValues(alpha: 0.35),
                                  width: 1.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: current.color.withValues(alpha: 0.3),
                                    blurRadius: 60,
                                    spreadRadius: 5,
                                  ),
                                ],
                              ),
                              child: Icon(current.icon, size: 72, color: current.color),
                            ),
                          ),
                        ),
                        const SizedBox(height: 48),

                        // Title + subtitle
                        FadeTransition(
                          opacity: _textFade,
                          child: Column(
                            children: [
                              ShaderMask(
                                shaderCallback: (bounds) => LinearGradient(
                                  colors: [Colors.white, current.color],
                                ).createShader(bounds),
                                child: Text(
                                  current.title,
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.outfit(
                                    fontSize: 32,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                    height: 1.1,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                current.subtitle,
                                textAlign: TextAlign.center,
                                style: GoogleFonts.outfit(
                                  fontSize: 16,
                                  color: const Color(0xFFB89EC4),
                                  height: 1.6,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(_slides.length, (i) {
                  final isActive = i == _slide;
                  return GestureDetector(
                    onTap: () => _goToSlide(i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 300),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: isActive ? 24 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: isActive ? const Color(0xFFF58220) : const Color(0xFF804A8A),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 28),

              // CTA button
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 40),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _next,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ).copyWith(
                      backgroundColor: WidgetStateProperty.all(Colors.transparent),
                    ),
                    child: Ink(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFFFCD00), Color(0xFFF58220)],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFF58220).withValues(alpha: 0.45),
                            blurRadius: 20,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        alignment: Alignment.center,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              _slide < _slides.length - 1 ? 'Continue' : 'Get Started',
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF3A0353),
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              _slide < _slides.length - 1 ? LucideIcons.chevronRight : LucideIcons.navigation2,
                              color: const Color(0xFF3A0353),
                              size: 18,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OnboardingSlide {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  const _OnboardingSlide({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
  });
}
