# 👨‍🔬 Experimental 
**This raycast extension was completely built with Claude Sonnet 4. It is in a very early draft state and meant as a personal proof of concept.**

# 🤖 Smart PDF Rename

**Finally, an end to chaotic PDF names!** This Raycast Extension automatically reads your PDF content and intelligently renames them – powered by AI and macOS Vision Framework.

## ✨ What it does

Smart PDF Rename transforms unreadable filenames like `scan_20250126_143022.pdf` automatically into clean, structured names like `2025-01-26 Deutsche Bank - Account Statement January.pdf`.

### 🧠 Intelligent Recognition

The extension combines **macOS Vision Framework** (for precise OCR) with **Raycast AI** (for intelligent analysis) and automatically extracts:

- **📅 Date** - Recognizes German and international formats
- **🏢 Sender** - Companies, institutions, or individuals  
- **📋 Subject** - Core content of the document

### 🎯 Perfect Naming Structure

All renamed files follow the schema:
```
YYYY-MM-DD Sender - Subject.pdf
```

**Real-world examples:**
- `2025-01-26 Stadtwerke München - Electricity Bill.pdf`
- `2024-12-15 Deutsche Bank - Credit Card Statement.pdf`
- `2025-01-10 AOK Bayern - Medical Benefits.pdf`
- `2024-11-30 Allianz Insurance - Damage Report.pdf`

## 🚀 How it works

1. **Select PDF in Finder** 📁
2. **Open Raycast** (`⌘ + Space`)
3. **Type "Rename Files"** ⌨️
4. **Press Return** ✅
5. **Done!** 🎉

The extension automatically analyzes the content, suggests intelligent names, and renames with a single keystroke.

## 🔮 The magic behind it

### OCR with Vision Framework
- **Local & Private** - No data leaves your Mac
- **Precise text recognition** - Even with poor quality scans
- **German language optimization** - Perfect for German documents

### AI-powered Analysis  
- **Raycast AI Integration** - Understands context and meaning
- **Intelligent extraction** - Recognizes relevant information
- **Fallback system** - Works even without AI

### Secure Renaming
- **AppleScript integration** - Native macOS support
- **Error handling** - Safe file operations
- **Preview mode** - See changes before execution

## 💡 Why is this cool?

### ⏰ Massive Time Savings
No more manual renaming. What used to take minutes now happens in seconds.

### 🎯 Perfect Organization  
Find documents instantly. Chronological sorting and meaningful names make searching obsolete.

### 🧠 Intelligent Automation
The AI understands content and selects the most important information – better than any regex.

### 🔒 Completely Private
Everything runs locally on your Mac. Your documents stay private and secure.

### 🎨 Native Integration
Seamless integration into your Mac workflow via Raycast. Feels like a native macOS feature.

## 🔧 Installation

1. Install Raycast (if not already installed)
2. Install extension via Raycast Store  
3. Start immediately – no configuration needed!

## 💭 Perfect for

- **📊 Invoices & Receipts** - Automatic categorization by vendor and date
- **🏦 Bank Documents** - Account statements, credit card bills, etc.
- **🏥 Medical Letters & Reports** - Chronological filing by doctor and date  
- **📋 Government Letters** - Tax office, insurance, authorities
- **📧 Scanned Emails** - Newsletters, confirmations, correspondence

## 🛠️ Technical Features

### AI-Powered Intelligence
- **Raycast AI API** - Uses structured prompts for precise extraction
- **JSON response parsing** - Reliable data extraction
- **Contextual understanding** - Better than pattern matching

### Vision Framework OCR
- **macOS native** - Optimized for Apple hardware
- **Multi-language support** - German and English recognition
- **High accuracy** - Even with challenging documents

### Robust Architecture
- **Async processing** - Non-blocking AI calls
- **Error handling** - Graceful fallbacks on failures
- **Debug logging** - Easy troubleshooting

---

**Smart PDF Rename turns file chaos into an organized archive – automatically, intelligently, and in seconds.** 🚀
