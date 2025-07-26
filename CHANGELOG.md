# Smart PDF Rename Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-26

### Hinzugefügt
- Erste Implementierung der Smart PDF Rename Extension
- OCR-Texterkennung mit macOS Vision Framework
- Automatische Dateinamen-Generierung mit Template "{date} {sender} - {subject}"
- Deutsche Sprachunterstützung für Datumsformate
- Integration mit Raycast List UI
- AppleScript-basierte sichere Datei-Umbenennung
- Fehlerbehandlung für nicht-lesbare PDFs
- Loading States und Success/Error Toasts
- Finder-Integration für Dateiauswahl
- Automatisches Schließen nach erfolgreicher Umbenennung

### Technische Details
- Swift-Script für Vision Framework OCR (`vision_ocr.swift`)
- TypeScript Utils für PDF-Extraktion und File-Renaming
- React/TSX UI-Komponenten für Raycast
- Template-basierte Namensgebung mit Sanitization
- Parallele Verarbeitung mehrerer PDF-Dateien

### Systemanforderungen
- macOS 10.15+ (Catalina)
- Raycast
- Node.js 16+
- TypeScript-Unterstützung