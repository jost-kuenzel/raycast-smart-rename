# Smart PDF Rename - Raycast Extension

Eine intelligente Raycast Extension zum automatischen Umbenennen von PDF-Dokumenten basierend auf ihrem Inhalt mit Hilfe des macOS Vision Frameworks für OCR.

## Features

- 🔍 **OCR-basierte Analyse**: Nutzt macOS Vision Framework für präzise Texterkennung
- 📄 **PDF-Optimiert**: Speziell für PDF-Dokumente entwickelt 
- 🇩🇪 **Deutsche Sprachunterstützung**: Erkennt deutsche Datumsformate und Textinhalte
- 🎯 **Smart Naming**: Automatische Extraktion von Datum, Absender und Betreff
- ⚡ **Raycast Integration**: Nahtlose Integration in den Raycast Workflow
- 🍎 **macOS Native**: Verwendet AppleScript für sichere Datei-Umbenennungen

## Workflow

1. **Finder**: PDF-Dateien auswählen
2. **Raycast**: "Rename Files" Command ausführen
3. **Analyse**: OCR-Extraktion der ersten PDF-Seite
4. **Vorschläge**: Automatische Generierung neuer Dateinamen
5. **Umbenennung**: Return-Taste bestätigt die Umbenennung
6. **Abschluss**: Command schließt automatisch

## Template Format

Die Extension nutzt folgendes Namensschema:
```
{YYYY-MM-DD} {Absender} - {Betreff}.pdf
```

**Beispiele:**
- `2024-01-15 Stadtwerke München - Stromrechnung Januar.pdf`
- `2024-02-03 Deutsche Bank - Kontoauszug Februar.pdf`
- `2024-03-20 Versicherung AG - Schadensmeldung Bestätigung.pdf`

## Installation

1. Repository klonen oder ZIP herunterladen
2. Terminal öffnen und zum Projektordner navigieren
3. Dependencies installieren:
   ```bash
   npm install
   ```
4. Extension entwickeln/testen:
   ```bash
   npm run dev
   ```
5. Extension bauen:
   ```bash
   npm run build
   ```

## Technische Details

### Komponenten

- **`vision_ocr.swift`**: Swift-Script für macOS Vision Framework OCR
- **`utils/pdf-extractor.ts`**: PDF-Textextraktion mit Swift-Integration
- **`utils/file-renamer.ts`**: Dateinamen-Generierung und AppleScript-Umbenennung
- **`rename-files.tsx`**: Hauptkomponente mit Raycast UI

### Systemanforderungen

- macOS 10.15+ (Catalina oder neuer)
- Raycast installiert
- Node.js 16+
- TypeScript

### Berechtigungen

Die Extension benötigt folgende Berechtigungen:
- **Finder-Zugriff**: Zum Lesen ausgewählter Dateien
- **Vision Framework**: Für OCR-Texterkennung
- **AppleScript**: Für sichere Datei-Umbenennungen

## Entwicklung

### Projektstruktur
```
src/
├── rename-files.tsx          # Hauptkomponente
├── vision_ocr.swift         # Swift OCR Script
└── utils/
    ├── pdf-extractor.ts     # PDF-Textextraktion
    └── file-renamer.ts      # Dateinamen-Generierung
```

### Debug-Modi

- **Development**: `npm run dev` - Hot-reload für schnelle Entwicklung
- **Lint**: `npm run lint` - Code-Quality-Checks
- **Build**: `npm run build` - Production Build

## Fehlerbehandlung

Die Extension behandelt folgende Fehlerfälle:
- Nicht lesbare PDF-Dateien
- OCR-Erkennungsfehler  
- Ungültige Dateinamen-Zeichen
- AppleScript-Ausführungsfehler
- Fehlende Finder-Auswahl

## Lizenz

MIT License - siehe LICENSE-Datei für Details.

## Beitragen

1. Fork des Repositories
2. Feature-Branch erstellen
3. Änderungen committen
4. Pull Request erstellen

## Support

Bei Problemen oder Fragen bitte ein Issue im GitHub Repository erstellen.