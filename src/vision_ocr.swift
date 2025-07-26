#!/usr/bin/env swift

import Foundation
import Vision
import Quartz
import AppKit

func extractTextFromPDF(at path: String) -> String {
    guard let url = URL(string: "file://" + path),
          let pdfDocument = PDFDocument(url: url),
          let firstPage = pdfDocument.page(at: 0) else {
        print("ERROR: Could not load PDF at path: \(path)")
        return ""
    }
    
    // Get the page as an image using Quartz
    let pageRect = firstPage.bounds(for: .mediaBox)
    let scale: CGFloat = 2.0 // Higher resolution for better OCR
    let scaledSize = CGSize(width: pageRect.width * scale, height: pageRect.height * scale)
    
    let nsImage = firstPage.thumbnail(of: scaledSize, for: .mediaBox)
    
    guard let cgImage = nsImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("ERROR: Could not convert PDF page to CGImage")
        return ""
    }
    
    // Perform OCR using Vision framework
    let request = VNRecognizeTextRequest()
    request.recognitionLanguages = ["de-DE", "en-US"] // German and English
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    
    var extractedText = ""
    let semaphore = DispatchSemaphore(value: 0)
    
    do {
        try handler.perform([request])
        
        guard let observations = request.results else {
            print("ERROR: No OCR results")
            semaphore.signal()
            return ""
        }
        
        let recognizedStrings = observations.compactMap { observation in
            return observation.topCandidates(1).first?.string
        }
        
        extractedText = recognizedStrings.joined(separator: "\n")
        semaphore.signal()
        
    } catch {
        print("ERROR: OCR failed with error: \(error)")
        semaphore.signal()
        return ""
    }
    
    semaphore.wait()
    return extractedText
}

// Main execution
guard CommandLine.arguments.count > 1 else {
    print("ERROR: No PDF path provided")
    exit(1)
}

let pdfPath = CommandLine.arguments[1]
let extractedText = extractTextFromPDF(at: pdfPath)

// Output the extracted text (will be captured by Node.js)
print(extractedText)
