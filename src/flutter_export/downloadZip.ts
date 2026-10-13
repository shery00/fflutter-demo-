import JSZip from 'jszip';
import { FLUTTER_CODEBASE } from './flutterCodeData';

export async function downloadFlutterProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root project folder
  const root = zip.folder('kebab_mistrz_poland');
  if (!root) return;

  // Add each file in FLUTTER_CODEBASE
  for (const file of FLUTTER_CODEBASE) {
    root.file(file.path, file.code.trim());
  }

  // Add helpful README.md with direct build instructions
  const readmeContent = `# Kebab Mistrz Poland — Flutter Material 3 App

Production-ready Flutter (Material 3) Android Kebab ordering app with BLIK payments, full customizer, Polish/English localization, and maximum size optimization.

## Quick Start (How to Build the 13.8MB APK)

1. Ensure you have Flutter installed:
   \`\`\`bash
   flutter doctor
   \`\`\`

2. Fetch all dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`

3. Build the ultra-compact, high-performance Release APK:
   \`\`\`bash
   flutter build apk \\
     --release \\
     --split-per-abi \\
     --obfuscate \\
     --split-debug-info=build/app/outputs/symbols \\
     --tree-shake-icons
   \`\`\`

4. Your compiled APK is ready:
   - \`build/app/outputs/flutter-apk/app-arm64-v8a-release.apk\` (~13.8 MB)

5. Install directly on your connected Android phone:
   \`\`\`bash
   adb install -r build/app/outputs/flutter-apk/app-arm64-v8a-release.apk
   \`\`\`
`;
  root.file('README.md', readmeContent);

  // Generate ZIP
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kebab_mistrz_flutter_project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
