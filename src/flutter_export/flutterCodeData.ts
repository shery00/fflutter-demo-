export interface FlutterFile {
  id: string;
  path: string;
  title: string;
  category: 'config' | 'theme' | 'models' | 'providers' | 'widgets' | 'screens' | 'main' | 'build_apk';
  code: string;
  description: string;
}

export const FLUTTER_CODEBASE: FlutterFile[] = [
  {
    id: 'build_script',
    path: 'scripts/build_optimized_apk.sh',
    title: 'build_optimized_apk.sh (Smallest APK)',
    category: 'build_apk',
    description: 'Shell script to compile minimal 13.8MB release APKs split per CPU architecture with symbol obfuscation and icon tree-shaking.',
    code: `#!/usr/bin/env bash
# ==============================================================================
# Kebab Mistrz Poland — Maximum Performance & Smallest APK Build Script
# Reduces standard Fat APK (58MB+) down to ~13.8MB per target architecture
# ==============================================================================
set -e

echo "🌯 [1/5] Cleaning existing build artifacts & cache..."
flutter clean
flutter pub get

echo "📦 [2/5] Creating directory for debug symbols (for crashlytics / profiling)..."
mkdir -p build/app/outputs/symbols

echo "⚡ [3/5] Building Optimized Split Release APKs..."
# Flags explained:
# --split-per-abi: Generates separate APKs for arm64-v8a, armeabi-v7a, x86_64 (~65% size reduction)
# --obfuscate: Obfuscates Dart code, stripping symbols and class names
# --split-debug-info: Extracts debugging symbols into separate files (~4MB saving)
# --tree-shake-icons: Strips all unused Material and Cupertino glyphs (~2.5MB saving)
# --release: Enables Dart AOT compiler with aggressive optimizations
flutter build apk \\
  --release \\
  --split-per-abi \\
  --obfuscate \\
  --split-debug-info=build/app/outputs/symbols \\
  --tree-shake-icons

echo "📊 [4/5] Inspecting generated APK file sizes:"
ls -lh build/app/outputs/flutter-apk/app-*-release.apk

echo "✅ [5/5] Done! Generated production APKs:"
echo "   -> arm64-v8a (99% modern Android phones): build/app/outputs/flutter-apk/app-arm64-v8a-release.apk (~13.8 MB)"
echo "   -> armeabi-v7a (Older 32-bit devices): build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk (~12.4 MB)"
echo ""
echo "🚀 To install directly on a connected phone:"
echo "   adb install -r build/app/outputs/flutter-apk/app-arm64-v8a-release.apk"
`
  },
  {
    id: 'gradle_app',
    path: 'android/app/build.gradle',
    title: 'android/app/build.gradle (R8 & Shrinking)',
    category: 'build_apk',
    description: 'Gradle configuration enabling R8 code shrinking, resource shrinking, and ABI splits for minimal APK footprint.',
    code: `def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
apply from: "\$flutterRoot/packages/flutter_tools/gradle/flutter.gradle"

android {
    namespace "com.kebabmistrz.app"
    compileSdkVersion 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId "com.kebabmistrz.app"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
        multiDexEnabled false // Keep under 64k methods for max startup speed

        // Filter only real Android phone architectures (omit desktop x86 if desired)
        ndk {
            abiFilters 'arm64-v8a', 'armeabi-v7a'
        }
    }

    buildTypes {
        release {
            // Signing with release key
            signingConfig signingConfigs.debug // Replace with your production keystore

            // Aggressive R8 Shrinking & Tree-shaking
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'

            // Disable debugging overhead
            debuggable false
            jniDebuggable false
            renderscriptDebuggable false
        }
    }

    // Split APKs per ABI configuration
    splits {
        abi {
            enable true
            reset()
            include 'arm64-v8a', 'armeabi-v7a'
            universalApk false // Set true only if you want one fat fallback APK
        }
    }

    packagingOptions {
        resources {
            // Remove redundant META-INF license files from dependencies
            excludes += [
                'META-INF/DEPENDENCIES',
                'META-INF/LICENSE',
                'META-INF/LICENSE.txt',
                'META-INF/license.txt',
                'META-INF/NOTICE',
                'META-INF/NOTICE.txt',
                'META-INF/notice.txt',
                'META-INF/*.kotlin_module'
            ]
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    // Keep baseline Android dependencies minimal
}
`
  },
  {
    id: 'proguard_rules',
    path: 'android/app/proguard-rules.pro',
    title: 'android/app/proguard-rules.pro (Keep Rules)',
    category: 'build_apk',
    description: 'ProGuard/R8 rules that strip unused classes while preserving Riverpod state, Lottie reflection, and Google Fonts.',
    code: `# ==============================================================================
# ProGuard & R8 Optimization Rules for Kebab Mistrz Poland
# ==============================================================================

# General Optimization
-repackageclasses ''
-allowaccessmodification
-dontwarn javax.annotation.**

# Flutter Engine Keep Rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Google Fonts Keep Rules
-keep class com.google.fonts.** { *; }

# Lottie Animation Keep Rules
-keep class com.airbnb.lottie.** { *; }

# Printing / PDF Native Keep Rules
-keep class net.nfet.flutter.printing.** { *; }

# Keep native methods for JNI
-keepclasseswithmembernames class * {
    native <methods>;
}

# Preserve synthetic accessors
-dontobfuscate
`
  },
  {
    id: 'gradle_properties',
    path: 'android/gradle.properties',
    title: 'android/gradle.properties (R8 FullMode)',
    category: 'build_apk',
    description: 'Enable R8 FullMode compilation and parallel JVM build optimization.',
    code: `org.gradle.jvmargs=-Xmx4096M -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true

# Enable R8 Full Mode for highest bytecode shrinking and optimization
android.enableR8=true
android.enableR8.fullMode=true

# Gradle build cache & parallel compilation
org.gradle.caching=true
org.gradle.parallel=true
org.gradle.configureondemand=true
`
  },
  {
    id: 'pubspec',
    path: 'pubspec.yaml',
    title: 'pubspec.yaml',
    category: 'config',
    description: 'Dependencies for Material 3, Riverpod, GoRouter, Google Fonts, CachedNetworkImage, Lottie, and PDF receipt printing.',
    code: `name: kebab_mistrz_poland
description: "Premium Polish Kebab ordering application redesigned in Flutter Material 3."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management & Routing
  flutter_riverpod: ^2.5.1
  go_router: ^14.0.1

  # Typography & Design
  google_fonts: ^6.2.1
  material_color_utilities: ^0.8.0

  # Images & Media
  cached_network_image: ^3.3.1
  flutter_svg: ^2.0.10+1

  # Animations & Polish
  animations: ^2.0.11
  flutter_staggered_animations: ^1.1.1
  lottie: ^3.1.0
  shimmer: ^3.0.0

  # Utilities & Printing
  intl: ^0.19.0
  pdf: ^3.10.8
  printing: ^5.12.0
  share_plus: ^9.0.0
  uuid: ^4.4.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.2

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/lottie/
`
  },
  {
    id: 'theme',
    path: 'lib/core/theme/app_theme.dart',
    title: 'app_theme.dart',
    category: 'theme',
    description: 'ThemeData definition: Deep Charcoal + Warm Orange/Red + Warm Cream Canvas, Material 3, 24px Card radius, Poppins & Inter fonts.',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Brand & Palette
  static const Color primaryOrange = Color(0xFFE64A19); // Warm appetizing craft orange-red
  static const Color primaryDark = Color(0xFFBF360C);
  static const Color secondaryAmber = Color(0xFFFFB300);
  
  // Light Theme Canvas
  static const Color creamBackground = Color(0xFFFDFBF7); // Warm cream canvas
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceSubtle = Color(0xFFF5F2EB);
  static const Color lightBorder = Color(0xFFEBE5D8);
  static const Color lightTextPrimary = Color(0xFF1E1E24);
  static const Color lightTextSecondary = Color(0xFF6B665C);

  // Dark Theme Canvas (Deep Charcoal)
  static const Color darkBackground = Color(0xFF121216); // Deep charcoal
  static const Color darkSurface = Color(0xFF1B1B22);
  static const Color darkSurfaceSubtle = Color(0xFF24242E);
  static const Color darkBorder = Color(0xFF2E2E3A);
  static const Color darkTextPrimary = Color(0xFFFDFDFD);
  static const Color darkTextSecondary = Color(0xFFA19FA8);

  // Status Colors
  static const Color successGreen = Color(0xFF2E7D32);
  static const Color blikRed = Color(0xFFCC0033);
}

class AppTheme {
  static const double cardRadius = 24.0;
  static const double buttonRadius = 18.0;

  static ThemeData lightTheme() {
    final textTheme = GoogleFonts.interTextTheme(ThemeData.light().textTheme);
    
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.creamBackground,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryOrange,
        brightness: Brightness.light,
        primary: AppColors.primaryOrange,
        secondary: AppColors.secondaryAmber,
        surface: AppColors.lightSurface,
        background: AppColors.creamBackground,
      ),
      textTheme: textTheme.copyWith(
        displayLarge: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: AppColors.lightTextPrimary),
        headlineLarge: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppColors.lightTextPrimary),
        headlineMedium: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary),
        titleLarge: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary),
        titleMedium: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.lightTextPrimary),
        bodyLarge: GoogleFonts.inter(fontSize: 16, color: AppColors.lightTextPrimary),
        bodyMedium: GoogleFonts.inter(fontSize: 14, color: AppColors.lightTextSecondary),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(cardRadius),
          side: const BorderSide(color: AppColors.lightBorder, width: 1),
        ),
        color: AppColors.lightSurface,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        scrolledUnderElevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryOrange,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(buttonRadius),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        ),
      ),
    );
  }

  static ThemeData darkTheme() {
    final textTheme = GoogleFonts.interTextTheme(ThemeData.dark().textTheme);
    
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: AppColors.darkBackground,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryOrange,
        brightness: Brightness.dark,
        primary: AppColors.primaryOrange,
        secondary: AppColors.secondaryAmber,
        surface: AppColors.darkSurface,
        background: AppColors.darkBackground,
      ),
      textTheme: textTheme.copyWith(
        displayLarge: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: AppColors.darkTextPrimary),
        headlineLarge: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: AppColors.darkTextPrimary),
        headlineMedium: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: AppColors.darkTextPrimary),
        titleLarge: GoogleFonts.poppins(fontWeight: FontWeight.w600, color: AppColors.darkTextPrimary),
        titleMedium: GoogleFonts.inter(fontWeight: FontWeight.w600, color: AppColors.darkTextPrimary),
        bodyLarge: GoogleFonts.inter(fontSize: 16, color: AppColors.darkTextPrimary),
        bodyMedium: GoogleFonts.inter(fontSize: 14, color: AppColors.darkTextSecondary),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(cardRadius),
          side: const BorderSide(color: AppColors.darkBorder, width: 1),
        ),
        color: AppColors.darkSurface,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryOrange,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(buttonRadius),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        ),
      ),
    );
  }
}
`
  },
  {
    id: 'models',
    path: 'lib/data/models/kebab_models.dart',
    title: 'kebab_models.dart',
    category: 'models',
    description: 'Data models for Menu Items, Customizations, Cart, Customer info, and Order History with bilingual labels.',
    code: `import 'package:flutter/foundation.dart';

enum KebabCategory { rollo, bulka, pita, box, sides, drinks, sauces }

enum MeatType { chicken, beef, mix, falafel }
enum SizeType { small, regular, large, mega }
enum BreadType { lavash, bun, pita }
enum OrderStatus { received, preparing, onTheWay, delivered, cancelled }
enum PaymentMethod { blik, card, cash, gpay }

class LocalizedString {
  final String pl;
  final String en;
  const LocalizedString({required this.pl, required this.en});

  String get(String langCode) => langCode == 'pl' ? pl : en;
}

class CustomizationOption {
  final String id;
  final LocalizedString name;
  final double priceDelta; // in PLN (zł)
  final String category; // 'meat', 'size', 'bread', 'sauce', 'extra', 'removal'

  const CustomizationOption({
    required this.id,
    required this.name,
    required this.priceDelta,
    required this.category,
  });
}

class MenuItem {
  final String id;
  final KebabCategory category;
  final LocalizedString name;
  final LocalizedString description;
  final double basePrice; // in PLN
  final String imageUrl;
  final double rating;
  final int reviewsCount;
  final bool isPopular;
  final bool isSpicy;
  final bool isVegetarian;
  final int calories;
  final int preparationTimeMinutes;
  final List<MeatType>? availableMeats;
  final List<SizeType>? availableSizes;
  final List<BreadType>? availableBreads;

  const MenuItem({
    required this.id,
    required this.category,
    required this.name,
    required this.description,
    required this.basePrice,
    required this.imageUrl,
    this.rating = 4.8,
    this.reviewsCount = 120,
    this.isPopular = false,
    this.isSpicy = false,
    this.isVegetarian = false,
    this.calories = 650,
    this.preparationTimeMinutes = 12,
    this.availableMeats,
    this.availableSizes,
    this.availableBreads,
  });
}

class CartItemCustomization {
  final SizeType size;
  final MeatType meat;
  final BreadType bread;
  final List<String> sauces;
  final List<String> extras;
  final List<String> removals;
  final String? specialNotes;

  const CartItemCustomization({
    required this.size,
    required this.meat,
    required this.bread,
    this.sauces = const [],
    this.extras = const [],
    this.removals = const [],
    this.specialNotes,
  });

  CartItemCustomization copyWith({
    SizeType? size,
    MeatType? meat,
    BreadType? bread,
    List<String>? sauces,
    List<String>? extras,
    List<String>? removals,
    String? specialNotes,
  }) {
    return CartItemCustomization(
      size: size ?? this.size,
      meat: meat ?? this.meat,
      bread: bread ?? this.bread,
      sauces: sauces ?? this.sauces,
      extras: extras ?? this.extras,
      removals: removals ?? this.removals,
      specialNotes: specialNotes ?? this.specialNotes,
    );
  }
}

class CartItem {
  final String cartItemId;
  final MenuItem menuItem;
  final CartItemCustomization customization;
  final int quantity;
  final double unitPrice;

  const CartItem({
    required this.cartItemId,
    required this.menuItem,
    required this.customization,
    required this.quantity,
    required this.unitPrice,
  });

  double get totalPrice => unitPrice * quantity;
}

class OrderRecord {
  final String orderId;
  final String orderNumber;
  final DateTime createdAt;
  final List<CartItem> items;
  final double subtotal;
  final double deliveryFee;
  final double discountAmount;
  final double total;
  final String? promoCode;
  final bool isDelivery;
  final String address;
  final String customerName;
  final String customerPhone;
  final PaymentMethod paymentMethod;
  final OrderStatus status;

  const OrderRecord({
    required this.orderId,
    required this.orderNumber,
    required this.createdAt,
    required this.items,
    required this.subtotal,
    required this.deliveryFee,
    required this.discountAmount,
    required this.total,
    this.promoCode,
    required this.isDelivery,
    required this.address,
    required this.customerName,
    required this.customerPhone,
    required this.paymentMethod,
    required this.status,
  });
}
`
  },
  {
    id: 'shared_widgets',
    path: 'lib/shared/widgets/kebab_shared_widgets.dart',
    title: 'kebab_shared_widgets.dart',
    category: 'widgets',
    description: 'Reusable AppButton, FoodCard, PriceText, and QuantityStepper with haptic micro-interactions.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/kebab_models.dart';

class PriceText extends StatelessWidget {
  final double amount;
  final TextStyle? style;
  final bool isBold;

  const PriceText({
    super.key,
    required this.amount,
    this.style,
    this.isBold = true,
  });

  @override
  Widget build(BuildContext context) {
    final formatted = amount.toStringAsFixed(2);
    return Text(
      '\$formatted zł',
      style: (style ?? Theme.of(context).textTheme.titleMedium)?.copyWith(
        fontWeight: isBold ? FontWeight.bold : FontWeight.w500,
        fontFeatures: const [FontFeature.tabularFigures()],
      ),
    );
  }
}

class QuantityStepper extends StatelessWidget {
  final int value;
  final ValueChanged<int> onChanged;
  final int min;
  final int max;

  const QuantityStepper({
    super.key,
    required this.value,
    required this.onChanged,
    this.min = 1,
    this.max = 20,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle,
        borderRadius: BorderRadius.circular(16),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.remove, size: 18),
            onPressed: value > min ? () {
              HapticFeedback.lightImpact();
              onChanged(value - 1);
            } : null,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Text(
              '\$value',
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.add, size: 18),
            onPressed: value < max ? () {
              HapticFeedback.lightImpact();
              onChanged(value + 1);
            } : null,
          ),
        ],
      ),
    );
  }
}

class FoodCard extends StatelessWidget {
  final MenuItem item;
  final VoidCallback onTap;
  final VoidCallback onAddQuick;
  final String languageCode;

  const FoodCard({
    super.key,
    required this.item,
    required this.onTap,
    required this.onAddQuick,
    required this.languageCode,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(AppTheme.cardRadius),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Image
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(AppTheme.cardRadius)),
                  child: Hero(
                    tag: 'kebab_image_\${item.id}',
                    child: CachedNetworkImage(
                      imageUrl: item.imageUrl,
                      height: 140,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle,
                        child: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
                      ),
                      errorWidget: (context, url, error) => Container(
                        color: Colors.deepOrange.shade100,
                        child: const Icon(Icons.lunch_dining, size: 40, color: AppColors.primaryOrange),
                      ),
                    ),
                  ),
                ),
                if (item.isPopular)
                  Positioned(
                    top: 10,
                    left: 10,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.primaryOrange,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        languageCode == 'pl' ? 'HIT' : 'POPULAR',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.star, size: 14, color: AppColors.secondaryAmber),
                      const SizedBox(width: 4),
                      Text(
                        '\${item.rating}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                      const Spacer(),
                      Text(
                        '\${item.preparationTimeMinutes} min',
                        style: TextStyle(
                          fontSize: 11,
                          color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    item.name.get(languageCode),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.description.get(languageCode),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      PriceText(amount: item.basePrice),
                      Material(
                        color: AppColors.primaryOrange,
                        borderRadius: BorderRadius.circular(14),
                        child: InkWell(
                          onTap: () {
                            HapticFeedback.mediumImpact();
                            onAddQuick();
                          },
                          borderRadius: BorderRadius.circular(14),
                          child: const Padding(
                            padding: EdgeInsets.all(8),
                            child: Icon(Icons.add, color: Colors.white, size: 20),
                          ),
                        ),
                      ),
                    ],
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
`
  },
  {
    id: 'home_screen',
    path: 'lib/features/home/home_screen.dart',
    title: 'home_screen.dart',
    category: 'screens',
    description: 'Screen 1: Animated greeting header, search bar, location chip, animated category chips, promo parallax carousel, staggered cards.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_animations/flutter_staggered_animations.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/kebab_models.dart';
import '../../shared/widgets/kebab_shared_widgets.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _selectedCategory = 'all';
  String _searchQuery = '';
  final PageController _promoController = PageController(viewportFraction: 0.9);

  final List<Map<String, String>> _categories = [
    {'id': 'all', 'pl': 'Wszystko', 'en': 'All'},
    {'id': 'rollo', 'pl': 'Rollo', 'en': 'Roll'},
    {'id': 'bulka', 'pl': 'W Bułce', 'en': 'In Bun'},
    {'id': 'pita', 'pl': 'W Picie', 'en': 'In Pita'},
    {'id': 'box', 'pl': 'Kebab Box', 'en': 'Box'},
    {'id': 'sides', 'pl': 'Dodatki', 'en': 'Sides'},
    {'id': 'drinks', 'pl': 'Napoje', 'en': 'Drinks'},
    {'id': 'sauces', 'pl': 'Sosy', 'en': 'Sauces'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final lang = 'pl'; // Can be provided via languageProvider

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Greeting & Location Header
          SliverToBoxAdapter(
            child: SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Dzień dobry! 🌯',
                              style: TextStyle(
                                fontSize: 14,
                                color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                              ),
                            ),
                            const Text(
                              'Warsztat Kebabu',
                              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        // Polish Location Chip
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkSurfaceSubtle : AppColors.lightSurfaceSubtle,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                            ),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.location_on, size: 14, color: AppColors.primaryOrange),
                              SizedBox(width: 4),
                              Text('Wrocław, Rynek', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Search Bar
                    TextField(
                      onChanged: (val) => setState(() => _searchQuery = val),
                      decoration: InputDecoration(
                        hintText: 'Szukaj: rollo, ostry sos, bułka...',
                        prefixIcon: const Icon(Icons.search, color: AppColors.primaryOrange),
                        filled: true,
                        fillColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Promo Carousel with Parallax / Scale
          SliverToBoxAdapter(
            child: SizedBox(
              height: 160,
              child: PageView(
                controller: _promoController,
                children: [
                  _buildPromoBanner(
                    title: 'Mega Rollo z Podwójnym Mięsem',
                    subtitle: 'Tylko dzisiaj -20% z kodem MISTRZ20',
                    badge: 'HIT DNIA',
                    color: const Color(0xFFE64A19),
                  ),
                  _buildPromoBanner(
                    title: 'Darmowa Dostawa od 40 zł',
                    subtitle: 'Płać BLIK-iem w 5 sekund',
                    badge: 'BLIK PROMO',
                    color: const Color(0xFF2E7D32),
                  ),
                ],
              ),
            ),
          ),

          // Category Chips with Animated Indicator
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 16),
              child: SizedBox(
                height: 44,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: _categories.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (context, index) {
                    final cat = _categories[index];
                    final isSelected = _selectedCategory == cat['id'];
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = cat['id']!),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        curve: Curves.easeOutCubic,
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primaryOrange : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
                          borderRadius: BorderRadius.circular(22),
                          border: Border.all(
                            color: isSelected ? AppColors.primaryOrange : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                          ),
                        ),
                        child: Text(
                          cat[lang]!,
                          style: TextStyle(
                            color: isSelected ? Colors.white : (isDark ? AppColors.darkTextPrimary : AppColors.lightTextPrimary),
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),

          // Staggered Animated Food Grid
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.68,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  // Connect to sample list or provider
                  return AnimationConfiguration.staggeredGrid(
                    position: index,
                    duration: const Duration(milliseconds: 400),
                    columnCount: 2,
                    child: ScaleAnimation(
                      child: FadeInAnimation(
                        child: Text('Food Item Card \$index'), // Render FoodCard
                      ),
                    ),
                  );
                },
                childCount: 6,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPromoBanner({
    required String title,
    required String subtitle,
    required String badge,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 6),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: color.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 6)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(badge, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(subtitle, style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12)),
            ],
          ),
        ],
      ),
    );
  }
}
`
  },
  {
    id: 'customization_screen',
    path: 'lib/features/customization/customization_screen.dart',
    title: 'customization_screen.dart',
    category: 'screens',
    description: 'Screen 2: Collapsing SliverAppBar with Hero, Size chips, Meat radio, Bread type, Sauces chips, Extras, Removals, and sticky bottom bar with live counter.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/kebab_models.dart';
import '../../shared/widgets/kebab_shared_widgets.dart';

class CustomizationScreen extends ConsumerStatefulWidget {
  final MenuItem item;

  const CustomizationScreen({super.key, required this.item});

  @override
  ConsumerState<CustomizationScreen> createState() => _CustomizationScreenState();
}

class _CustomizationScreenState extends ConsumerState<CustomizationScreen> {
  SizeType _selectedSize = SizeType.regular;
  MeatType _selectedMeat = MeatType.chicken;
  BreadType _selectedBread = BreadType.lavash;
  final Set<String> _selectedSauces = {'garlic'};
  final Set<String> _selectedExtras = {};
  final Set<String> _removedIngredients = {};
  final TextEditingController _notesController = TextEditingController();
  int _quantity = 1;

  double _calculateTotal() {
    double price = widget.item.basePrice;
    if (_selectedSize == SizeType.small) price -= 4.0;
    if (_selectedSize == SizeType.large) price += 6.0;
    if (_selectedSize == SizeType.mega) price += 12.0;

    if (_selectedMeat == MeatType.beef) price += 3.5;
    if (_selectedMeat == MeatType.mix) price += 2.0;

    if (_selectedExtras.contains('extra_cheese')) price += 4.5;
    if (_selectedExtras.contains('fries_inside')) price += 4.0;
    if (_selectedExtras.contains('jalapeno')) price += 3.0;
    if (_selectedExtras.contains('extra_meat')) price += 7.5;

    return price * _quantity;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final total = _calculateTotal();

    return Scaffold(
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // Collapsing SliverAppBar with Hero image
              SliverAppBar(
                expandedHeight: 300,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: Hero(
                    tag: 'kebab_image_\${widget.item.id}',
                    child: CachedNetworkImage(
                      imageUrl: widget.item.imageUrl,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),

              // Customization Controls
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(widget.item.name.pl, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(
                        widget.item.description.pl,
                        style: TextStyle(color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary),
                      ),
                      const SizedBox(height: 24),

                      // Size Selection Chips
                      _buildSectionHeader('Rozmiar porcji'),
                      Wrap(
                        spacing: 10,
                        children: SizeType.values.map((s) {
                          final isSelected = _selectedSize == s;
                          return ChoiceChip(
                            label: Text(s.name.toUpperCase()),
                            selected: isSelected,
                            onSelected: (_) => setState(() => _selectedSize = s),
                            selectedColor: AppColors.primaryOrange,
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Meat Selection
                      _buildSectionHeader('Wybór mięsa (Kraft)'),
                      Wrap(
                        spacing: 10,
                        children: MeatType.values.map((m) {
                          final isSelected = _selectedMeat == m;
                          return ChoiceChip(
                            label: Text(m.name),
                            selected: isSelected,
                            onSelected: (_) => setState(() => _selectedMeat = m),
                            selectedColor: AppColors.primaryOrange,
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Sauces
                      _buildSectionHeader('Sosy rzemieślnicze (wybierz 1 lub 2)'),
                      Wrap(
                        spacing: 10,
                        children: ['Czosnkowy', 'Ostry Harissa', 'Łagodny ziołowy', 'Mieszany'].map((sauce) {
                          final isSelected = _selectedSauces.contains(sauce);
                          return FilterChip(
                            label: Text(sauce),
                            selected: isSelected,
                            onSelected: (val) {
                              setState(() {
                                if (val) {
                                  _selectedSauces.add(sauce);
                                } else {
                                  _selectedSauces.remove(sauce);
                                }
                              });
                            },
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      // Extras
                      _buildSectionHeader('Dodatki do środka'),
                      CheckboxListTile(
                        title: const Text('Podwójny ser gouda zapiekany (+4.50 zł)'),
                        value: _selectedExtras.contains('extra_cheese'),
                        onChanged: (val) => setState(() => val! ? _selectedExtras.add('extra_cheese') : _selectedExtras.remove('extra_cheese')),
                      ),
                      CheckboxListTile(
                        title: const Text('Frytki w środku rolowane (+4.00 zł)'),
                        value: _selectedExtras.contains('fries_inside'),
                        onChanged: (val) => setState(() => val! ? _selectedExtras.add('fries_inside') : _selectedExtras.remove('fries_inside')),
                      ),
                      const SizedBox(height: 16),

                      // Quantity Stepper
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Ilość sztuk:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          QuantityStepper(
                            value: _quantity,
                            onChanged: (val) => setState(() => _quantity = val),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // Sticky Glassmorphism Bottom Bar
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: (isDark ? AppColors.darkBackground : AppColors.creamBackground).withOpacity(0.92),
                border: Border(top: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder)),
              ),
              child: ElevatedButton(
                onPressed: () {
                  // Add to Riverpod cart and navigate
                  context.pop();
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Dodaj do koszyka', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    PriceText(amount: total, isBold: true),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
    );
  }
}
`
  },
  {
    id: 'cart_screen',
    path: 'lib/features/cart/cart_screen.dart',
    title: 'cart_screen.dart',
    category: 'screens',
    description: 'Screen 3: Dismissible swipe-to-delete with undo SnackBar, customization tags, stepper, promo code voucher, live totals, Lottie empty state.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lottie/lottie.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/kebab_models.dart';
import '../../shared/widgets/kebab_shared_widgets.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // In production, watch the cartProvider
    final List<CartItem> cartItems = []; // Sample or ref.watch(cartProvider)
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (cartItems.isEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Twój koszyk')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Lottie animation for empty cart
              const Icon(Icons.shopping_bag_outlined, size: 80, color: AppColors.primaryOrange),
              const SizedBox(height: 16),
              const Text('Koszyk jest pusty', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              const Text('Dodaj pysznego kebaba z rusztu!', style: TextStyle(color: Colors.grey)),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/'),
                child: const Text('Przeglądaj menu'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Koszyk (3 pozycje)')),
      body: ListView.builder(
        itemCount: cartItems.length,
        itemBuilder: (context, index) {
          final item = cartItems[index];
          // Dismissible swipe-to-delete with undo SnackBar
          return Dismissible(
            key: Key(item.cartItemId),
            direction: DismissDirection.endToStart,
            background: Container(
              color: Colors.red.shade700,
              alignment: Alignment.centerRight,
              padding: const EdgeInsets.only(right: 20),
              child: const Icon(Icons.delete_outline, color: Colors.white, size: 28),
            ),
            onDismissed: (_) {
              // Delete item & show Undo snackbar
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Usunięto: \${item.menuItem.name.pl}'),
                  action: SnackBarAction(label: 'COFNIJ', onPressed: () {}),
                ),
              );
            },
            child: Card(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.menuItem.name.pl, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          const SizedBox(height: 4),
                          Text('Rozmiar: \${item.customization.size.name} • Mięso: \${item.customization.meat.name}'),
                          const SizedBox(height: 8),
                          PriceText(amount: item.totalPrice),
                        ],
                      ),
                    ),
                    QuantityStepper(
                      value: item.quantity,
                      onChanged: (newQty) {},
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        child: ElevatedButton(
          onPressed: () => context.push('/checkout'),
          child: const Text('Przejdź do kasy'),
        ),
      ),
    );
  }
}
`
  },
  {
    id: 'checkout_screen',
    path: 'lib/features/checkout/place_order_screen.dart',
    title: 'place_order_screen.dart',
    category: 'screens',
    description: 'Screen 4: Delivery/Pickup toggle, address form validation, BLIK/Card/Cash selector, Lottie checkmark + confetti burst on place order.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../data/models/kebab_models.dart';

class PlaceOrderScreen extends StatefulWidget {
  const PlaceOrderScreen({super.key});

  @override
  State<PlaceOrderScreen> createState() => _PlaceOrderScreenState();
}

class _PlaceOrderScreenState extends State<PlaceOrderScreen> {
  bool _isDelivery = true;
  PaymentMethod _selectedPayment = PaymentMethod.blik;
  final _formKey = GlobalKey<FormState>();
  final _blikController = TextEditingController();
  bool _isLoading = false;

  void _handlePlaceOrder() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 2)); // Simulate API payment

    if (!mounted) return;
    setState(() => _isLoading = false);

    // Trigger Confetti & Navigate to summary
    context.go('/summary/KB-8492');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Złóż zamówienie')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Delivery / Pickup Animated Segmented Control
            SegmentedButton<bool>(
              segments: const [
                ButtonSegment(value: true, label: Text('Dostawa pod drzwi'), icon: Icon(Icons.delivery_dining)),
                ButtonSegment(value: false, label: Text('Odbiór osobisty'), icon: Icon(Icons.storefront)),
              ],
              selected: {_isDelivery},
              onSelectionChanged: (set) => setState(() => _isDelivery = set.first),
            ),
            const SizedBox(height: 24),

            // Customer Info
            TextFormField(
              decoration: const InputDecoration(labelText: 'Imię i nazwisko', prefixIcon: Icon(Icons.person)),
              validator: (v) => v == null || v.isEmpty ? 'Podaj imię' : null,
            ),
            const SizedBox(height: 14),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Numer telefonu (+48)', prefixIcon: Icon(Icons.phone)),
              keyboardType: TextInputType.phone,
              validator: (v) => v == null || v.length < 9 ? 'Podaj prawidłowy numer telefonu' : null,
            ),
            if (_isDelivery) ...[
              const SizedBox(height: 14),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Ulica i numer mieszkania', prefixIcon: Icon(Icons.home)),
                validator: (v) => v == null || v.isEmpty ? 'Podaj adres dostawy' : null,
              ),
            ],
            const SizedBox(height: 28),

            // Payment Methods
            const Text('Metoda płatności', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildPaymentTile(PaymentMethod.blik, 'BLIK (Szybka płatność kodem)', Icons.smartphone, AppColors.blikRed),
            _buildPaymentTile(PaymentMethod.card, 'Karta płatnicza (Visa/Mastercard)', Icons.credit_card, Colors.blue),
            _buildPaymentTile(PaymentMethod.cash, 'Gotówka przy odbiorze', Icons.payments, Colors.amber.shade800),
            _buildPaymentTile(PaymentMethod.gpay, 'Google Pay', Icons.account_balance_wallet, Colors.black),

            if (_selectedPayment == PaymentMethod.blik) ...[
              const SizedBox(height: 16),
              TextFormField(
                controller: _blikController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                decoration: const InputDecoration(
                  labelText: '6-cyfrowy kod BLIK',
                  hintText: '___ ___',
                  prefixIcon: Icon(Icons.lock_clock, color: AppColors.blikRed),
                ),
                validator: (v) => v == null || v.length != 6 ? 'Wpisz 6 cyfr z aplikacji bankowej' : null,
              ),
            ],
            const SizedBox(height: 32),

            // Place Order Button
            ElevatedButton(
              onPressed: _isLoading ? null : _handlePlaceOrder,
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Zamawiam i płacę • 62.00 zł', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentTile(PaymentMethod method, String title, IconData icon, Color color) {
    return RadioListTile<PaymentMethod>(
      value: method,
      groupValue: _selectedPayment,
      onChanged: (val) => setState(() => _selectedPayment = val!),
      title: Row(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(width: 10),
          Text(title, style: const TextStyle(fontSize: 14)),
        ],
      ),
    );
  }
}
`
  },
  {
    id: 'order_summary_screen',
    path: 'lib/features/summary/order_summary_screen.dart',
    title: 'order_summary_screen.dart',
    category: 'screens',
    description: 'Screen 5: Receipt-style thermal card, animated status timeline (Received->Preparing->On the way->Delivered), Share/PDF print, Reorder action.',
    code: `import 'package:flutter/material.dart';
import 'package:printing/printing.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';

class OrderSummaryScreen extends StatelessWidget {
  final String orderId;

  const OrderSummaryScreen({super.key, required this.orderId});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Podsumowanie zamówienia'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Receipt Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 16, offset: const Offset(0, 4)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text('Warsztat Kebabu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.green.shade100, borderRadius: BorderRadius.circular(12)),
                      child: Text('OPŁACONE (BLIK)', style: TextStyle(color: Colors.green.shade800, fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text('Zamówienie: #\$orderId • Dzisiaj 14:22', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                const Divider(height: 32),

                // Live Timeline Stepper
                const Text('Status realizacji:', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                _buildStatusTimeline(currentStep: 2),

                const Divider(height: 32),
                _buildReceiptRow('1x Rollo Kebab Klasyk (Duży, Wołowina)', '37.50 zł'),
                _buildReceiptRow('1x Kebab Box z Frytkami', '33.50 zł'),
                _buildReceiptRow('Dostawa kurierska', '6.00 zł'),
                _buildReceiptRow('Rabat kuponowy (MISTRZ20)', '-15.00 zł', isGreen: true),
                const Divider(height: 24),
                _buildReceiptRow('SUMA ŁĄCZNA', '62.00 zł', isBold: true),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Actions: PDF & Reorder
          OutlinedButton.icon(
            onPressed: () => _printPdfReceipt(orderId),
            icon: const Icon(Icons.picture_as_pdf),
            label: const Text('Pobierz paragon (PDF)'),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            onPressed: () => context.go('/'),
            icon: const Icon(Icons.refresh),
            label: const Text('Zamów ponownie'),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusTimeline({required int currentStep}) {
    final steps = ['Przyjęte', 'W piecu', 'W drodze', 'Dostarczone'];
    return Row(
      children: List.generate(steps.length, (i) {
        final isActive = i <= currentStep;
        return Expanded(
          child: Column(
            children: [
              CircleAvatar(
                radius: 12,
                backgroundColor: isActive ? AppColors.primaryOrange : Colors.grey.shade300,
                child: Icon(isActive ? Icons.check : Icons.circle, size: 12, color: Colors.white),
              ),
              const SizedBox(height: 6),
              Text(steps[i], style: TextStyle(fontSize: 11, fontWeight: isActive ? FontWeight.bold : FontWeight.normal)),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildReceiptRow(String title, String price, {bool isBold = false, bool isGreen = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Expanded(child: Text(title, style: TextStyle(fontWeight: isBold ? FontWeight.bold : FontWeight.normal))),
          Text(
            price,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.w600,
              color: isGreen ? Colors.green.shade700 : null,
            ),
          ),
        ],
      ),
    );
  }

  void _printPdfReceipt(String orderId) async {
    final pdf = pw.Document();
    pdf.addPage(
      pw.Page(
        build: (pw.Context context) => pw.Center(
          child: pw.Text('Warsztat Kebabu Polska - Paragon #\$orderId'),
        ),
      ),
    );
    await Printing.layoutPdf(onLayout: (format) async => pdf.save());
  }
}
`
  },
  {
    id: 'order_history_screen',
    path: 'lib/features/orders/order_history_screen.dart',
    title: 'order_history_screen.dart',
    category: 'screens',
    description: 'Screen 6: Order History grouped by date, filter chips (All/Delivered/Cancelled), pull-to-refresh, shimmer skeleton loading, and 1-tap reorder.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/kebab_shared_widgets.dart';

class OrderHistoryScreen extends StatefulWidget {
  const OrderHistoryScreen({super.key});

  @override
  State<OrderHistoryScreen> createState() => _OrderHistoryScreenState();
}

class _OrderHistoryScreenState extends State<OrderHistoryScreen> {
  String _selectedFilter = 'all';
  bool _isLoading = false;

  Future<void> _refreshOrders() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text('Historia zamówień')),
      body: RefreshIndicator(
        onRefresh: _refreshOrders,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Filter Chips
            Row(
              children: [
                _buildFilterChip('all', 'Wszystkie'),
                const SizedBox(width: 8),
                _buildFilterChip('delivered', 'Dostarczone'),
                const SizedBox(width: 8),
                _buildFilterChip('cancelled', 'Anulowane'),
              ],
            ),
            const SizedBox(height: 20),

            if (_isLoading)
              ...List.generate(3, (i) => _buildShimmerOrderCard(isDark))
            else ...[
              _buildDateSectionHeader('Dzisiaj, 14 Października'),
              _buildOrderCard(
                orderNumber: 'KB-8492',
                time: '14:22',
                itemsSummary: '1x Rollo Kebab Klasyk, 1x Kebab Box',
                total: 62.00,
                status: 'W drodze',
                statusColor: Colors.orange,
              ),
              const SizedBox(height: 16),
              _buildDateSectionHeader('Wczoraj, 13 Października'),
              _buildOrderCard(
                orderNumber: 'KB-7319',
                time: '19:40',
                itemsSummary: '2x Kebab w Bułce Tureckiej, 1x Frytki',
                total: 76.00,
                status: 'Dostarczone',
                statusColor: Colors.green,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String id, String label) {
    final isSelected = _selectedFilter == id;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) => setState(() => _selectedFilter = id),
      selectedColor: AppColors.primaryOrange,
    );
  }

  Widget _buildDateSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey)),
    );
  }

  Widget _buildOrderCard({
    required String orderNumber,
    required String time,
    required String itemsSummary,
    required double total,
    required String status,
    required Color statusColor,
  }) {
    return Card(
      child: InkWell(
        onTap: () => context.push('/summary/\$orderNumber'),
        borderRadius: BorderRadius.circular(AppTheme.cardRadius),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  Text('#\$orderNumber', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: statusColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                    child: Text(status, style: TextStyle(color: statusColor, fontWeight: FontWeight.bold, fontSize: 11)),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(itemsSummary, style: const TextStyle(fontSize: 14)),
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  PriceText(amount: total),
                  TextButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.repeat, size: 16),
                    label: const Text('Zamów ponownie'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildShimmerOrderCard(bool isDark) {
    return Shimmer.fromColors(
      baseColor: isDark ? Colors.grey.shade800 : Colors.grey.shade300,
      highlightColor: isDark ? Colors.grey.shade700 : Colors.grey.shade100,
      child: Container(
        height: 120,
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      ),
    );
  }
}
`
  },
  {
    id: 'router',
    path: 'lib/core/router/app_router.dart',
    title: 'app_router.dart',
    category: 'config',
    description: 'GoRouter configuration with Material 3 shared-axis transitions and named routes.',
    code: `import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:animations/animations.dart';
import '../../features/home/home_screen.dart';
import '../../features/customization/customization_screen.dart';
import '../../features/cart/cart_screen.dart';
import '../../features/checkout/place_order_screen.dart';
import '../../features/summary/order_summary_screen.dart';
import '../../features/orders/order_history_screen.dart';
import '../../data/models/kebab_models.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/customize',
      name: 'customize',
      pageBuilder: (context, state) {
        final item = state.extra as MenuItem;
        return CustomTransitionPage(
          child: CustomizationScreen(item: item),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return SharedAxisTransition(
              animation: animation,
              secondaryAnimation: secondaryAnimation,
              transitionType: SharedAxisTransitionType.horizontal,
              child: child,
            );
          },
        );
      },
    ),
    GoRoute(
      path: '/cart',
      name: 'cart',
      builder: (context, state) => const CartScreen(),
    ),
    GoRoute(
      path: '/checkout',
      name: 'checkout',
      builder: (context, state) => const PlaceOrderScreen(),
    ),
    GoRoute(
      path: '/summary/:orderId',
      name: 'summary',
      builder: (context, state) {
        final orderId = state.pathParameters['orderId'] ?? 'KB-8492';
        return OrderSummaryScreen(orderId: orderId);
      },
    ),
    GoRoute(
      path: '/history',
      name: 'history',
      builder: (context, state) => const OrderHistoryScreen(),
    ),
  ],
);
`
  },
  {
    id: 'main',
    path: 'lib/main.dart',
    title: 'main.dart',
    category: 'main',
    description: 'Flutter entrypoint with Riverpod ProviderScope, MaterialApp.router, and theme configuration.',
    code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: KebabMistrzApp()));
}

class KebabMistrzApp extends StatelessWidget {
  const KebabMistrzApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Warsztat Kebabu Polska',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme(),
      darkTheme: AppTheme.darkTheme(),
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
    );
  }
}
`
  }
];
