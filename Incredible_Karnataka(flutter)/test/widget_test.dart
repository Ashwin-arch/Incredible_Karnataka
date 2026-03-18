// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:karnataka_tourism/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // Note: Wrapped in a container with a fixed size for some tests if needed, 
    // but building the root app is usually fine for a smoke test.
    await tester.pumpWidget(const IncredibleKarnatakaApp());

    // Verify that the app starts (e.g., check for localized text or a specific icon)
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
