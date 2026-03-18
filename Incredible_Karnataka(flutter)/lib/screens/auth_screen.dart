import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'main_shell.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> with SingleTickerProviderStateMixin {
  bool _isLogin = true;
  bool _isLoading = false;
  bool _obscurePassword = true;

  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();

  String? _emailError;
  String? _passwordError;
  String? _nameError;

  late AnimationController _modeCtrl;
  late Animation<double> _modeFade;
  late Animation<Offset> _modeSlide;

  @override
  void initState() {
    super.initState();
    _modeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 350),
    )..value = 1.0;
    _modeFade = Tween(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _modeCtrl, curve: Curves.easeOut),
    );
    _modeSlide = Tween(begin: const Offset(0, 0.1), end: Offset.zero).animate(
      CurvedAnimation(parent: _modeCtrl, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _nameCtrl.dispose();
    _modeCtrl.dispose();
    super.dispose();
  }

  void _toggleMode() async {
    await _modeCtrl.reverse();
    setState(() {
      _isLogin = !_isLogin;
      _emailError = null;
      _passwordError = null;
      _nameError = null;
    });
    _modeCtrl.forward();
  }

  bool _validate() {
    final email = _emailCtrl.text.trim();
    final pass = _passwordCtrl.text;
    final name = _nameCtrl.text.trim();

    setState(() {
      _emailError = email.contains('@') ? null : 'Valid email required';
      _passwordError = pass.length >= 6 ? null : 'Min 6 characters';
      _nameError = _isLogin || name.isNotEmpty ? null : 'Name required';
    });

    return _emailError == null && _passwordError == null && _nameError == null;
  }

  void _submit() {
    if (!_validate()) return;
    setState(() => _isLoading = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) => const MainShell(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) =>
                FadeTransition(opacity: animation, child: child),
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Center(
                  child: Column(
                    children: [
                      // Logo icon
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          gradient: const LinearGradient(
                            colors: [Color(0xFFFFCD00), Color(0xFFF58220)],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFFF58220).withValues(alpha: 0.4),
                              blurRadius: 32,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Icon(LucideIcons.landmark, size: 38, color: Color(0xFF3A0353)),
                      ),
                      const SizedBox(height: 20),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child: Text(
                          _isLogin ? 'Welcome back' : 'Join us today',
                          key: ValueKey(_isLogin),
                          style: GoogleFonts.outfit(
                            fontSize: 26,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(height: 4),
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 300),
                        child: Text(
                          _isLogin ? 'Plan. Discover. Experience.' : "Discover Karnataka's true soul",
                          key: ValueKey(_isLogin),
                          style: GoogleFonts.outfit(
                            fontSize: 14,
                            color: const Color(0xFFB89EC4),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),

                // Form card
                FadeTransition(
                  opacity: _modeFade,
                  child: SlideTransition(
                    position: _modeSlide,
                    child: Container(
                      padding: const EdgeInsets.all(28),
                      decoration: BoxDecoration(
                        color: const Color(0xFF804A8A).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: const Color(0xFF804A8A).withValues(alpha: 0.25),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.3),
                            blurRadius: 24,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // Name field (register only)
                          AnimatedCrossFade(
                            duration: const Duration(milliseconds: 300),
                            crossFadeState: _isLogin
                                ? CrossFadeState.showFirst
                                : CrossFadeState.showSecond,
                            firstChild: const SizedBox.shrink(),
                            secondChild: Column(
                              children: [
                                _buildField(
                                  controller: _nameCtrl,
                                  label: 'Full name',
                                  icon: LucideIcons.user,
                                  error: _nameError,
                                ),
                                const SizedBox(height: 16),
                              ],
                            ),
                          ),

                          _buildField(
                            controller: _emailCtrl,
                            label: 'Email address',
                            icon: LucideIcons.mail,
                            keyboardType: TextInputType.emailAddress,
                            error: _emailError,
                          ),
                          const SizedBox(height: 16),
                          _buildField(
                            controller: _passwordCtrl,
                            label: 'Password',
                            icon: LucideIcons.lock,
                            obscure: _obscurePassword,
                            error: _passwordError,
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye,
                                size: 18,
                                color: const Color(0xFFB89EC4),
                              ),
                              onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                            ),
                          ),
                          const SizedBox(height: 28),

                          // Submit button
                          SizedBox(
                            width: double.infinity,
                            child: GestureDetector(
                              onTap: _isLoading ? null : _submit,
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 18),
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(
                                    colors: [Color(0xFFFFCD00), Color(0xFFF58220)],
                                  ),
                                  borderRadius: BorderRadius.circular(14),
                                  boxShadow: [
                                    BoxShadow(
                                      color: const Color(0xFFF58220).withValues(alpha: 0.45),
                                      blurRadius: 20,
                                      offset: const Offset(0, 8),
                                    ),
                                  ],
                                ),
                                child: Center(
                                  child: _isLoading
                                      ? const SizedBox(
                                          width: 22,
                                          height: 22,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2.5,
                                            color: Color(0xFF3A0353),
                                          ),
                                        )
                                      : Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Icon(
                                              _isLogin ? LucideIcons.logIn : LucideIcons.userPlus,
                                              color: const Color(0xFF3A0353),
                                              size: 18,
                                            ),
                                            const SizedBox(width: 8),
                                            Text(
                                              _isLogin ? 'Log In' : 'Create Account',
                                              style: GoogleFonts.outfit(
                                                fontSize: 16,
                                                fontWeight: FontWeight.w700,
                                                color: const Color(0xFF3A0353),
                                              ),
                                            ),
                                          ],
                                        ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 28),

                // Toggle login/register
                Center(
                  child: GestureDetector(
                    onTap: _toggleMode,
                    child: RichText(
                      text: TextSpan(
                        style: GoogleFonts.outfit(fontSize: 14, color: const Color(0xFFB89EC4)),
                        children: [
                          TextSpan(text: _isLogin ? "Don't have an account? " : "Already have an account? "),
                          TextSpan(
                            text: _isLogin ? 'Create new account' : 'Log in',
                            style: GoogleFonts.outfit(
                              color: const Color(0xFFF58220),
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    bool obscure = false,
    String? error,
    Widget? suffixIcon,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.06),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: error != null
                  ? Colors.redAccent.withValues(alpha: 0.6)
                  : const Color(0xFF804A8A).withValues(alpha: 0.3),
            ),
          ),
          child: TextField(
            controller: controller,
            keyboardType: keyboardType,
            obscureText: obscure,
            style: GoogleFonts.outfit(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              hintText: label,
              hintStyle: GoogleFonts.outfit(color: const Color(0xFFB89EC4), fontSize: 14),
              prefixIcon: Icon(icon, size: 18, color: const Color(0xFFB89EC4)),
              suffixIcon: suffixIcon,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            ),
          ),
        ),
        if (error != null) ...[
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.only(left: 12),
            child: Text(
              error,
              style: GoogleFonts.outfit(fontSize: 11, color: Colors.redAccent),
            ),
          ),
        ],
      ],
    );
  }
}
