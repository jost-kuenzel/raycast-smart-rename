import { showToast, Toast } from "@raycast/api";

export interface RenameOperation {
  originalPath: string;
  newPath: string;
  originalName: string;
  newName: string;
}

/**
 * Generates a filename from extracted text using template: {date} {sender} - {subject}
 */
export function generateFileName(extractedText: string, originalFileName: string): string {
  const cleanText = extractedText.replace(/\s+/g, " ").trim();

  // Extract date (German formats)
  const datePattern =
    /(\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4})|(\d{1,2}\.\s*(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jan|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez)\.?\s*\d{2,4})/gi;
  const dateMatch = cleanText.match(datePattern);
  let date = "";

  if (dateMatch) {
    const rawDate = dateMatch[0];
    // Convert to YYYY-MM-DD format
    date = formatDate(rawDate);
  }

  // Extract sender (look for patterns like "Von:", "From:", company names)
  const senderPatterns = [
    /(?:Von|From|Absender):\s*([^\n\r]{1,50})/gi,
    /([A-ZÄÖÜ][a-zäöüß]+\s+(?:GmbH|AG|Ltd|LLC|Inc|Co\.?))/g,
    /([A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+)(?=\s|$)/g,
  ];

  let sender = "";
  for (const pattern of senderPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      sender = match[0].replace(/(?:Von|From|Absender):\s*/gi, "").trim();
      break;
    }
  }

  // Extract subject (first meaningful line or after "Betreff:", "Subject:")
  const subjectPatterns = [/(?:Betreff|Subject|Re):\s*([^\n\r]{1,80})/gi, /^([A-ZÄÖÜ][^.\n\r]{10,80})/m];

  let subject = "";
  for (const pattern of subjectPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      subject = match[1] || match[0];
      subject = subject.replace(/(?:Betreff|Subject|Re):\s*/gi, "").trim();
      break;
    }
  }

  // Clean and sanitize components
  date = sanitizeFileName(date);
  sender = sanitizeFileName(sender).substring(0, 30);
  subject = sanitizeFileName(subject).substring(0, 50);

  // Build filename
  let newName = "";
  if (date) newName += date;
  if (sender) newName += (newName ? " " : "") + sender;
  if (subject) newName += (newName ? " - " : "") + subject;

  // Fallback if no content extracted
  if (!newName) {
    newName = originalFileName.replace(/\.pdf$/i, "");
  }

  return newName + ".pdf";
}

/**
 * Formats a German date string to YYYY-MM-DD
 */
function formatDate(dateStr: string): string {
  try {
    // Handle various German date formats
    const cleanDate = dateStr.replace(/[^\d\.\-\/]/g, "");
    const parts = cleanDate.split(/[\.\-\/]/);

    if (parts.length === 3) {
      let day = parseInt(parts[0]);
      let month = parseInt(parts[1]);
      let year = parseInt(parts[2]);

      // Handle 2-digit years
      if (year < 100) {
        year += year < 50 ? 2000 : 1900;
      }

      // Format as YYYY-MM-DD
      return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    }
  } catch (error) {
    console.error("Date parsing error:", error);
  }

  return "";
}

/**
 * Sanitizes a filename by removing invalid characters
 */
function sanitizeFileName(str: string): string {
  return str
    .replace(/[<>:"/\\|?*]/g, "") // Remove invalid chars
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Executes file renames using AppleScript
 */
export async function executeRenames(operations: RenameOperation[]): Promise<boolean> {
  try {
    for (const operation of operations) {
      const appleScript = `
        tell application "Finder"
          set theFile to POSIX file "${operation.originalPath}" as alias
          set name of theFile to "${operation.newName}"
        end tell
      `;

      // Execute AppleScript using osascript
      const { spawn } = eval("require")("child_process");

      await new Promise<void>((resolve, reject) => {
        const process = spawn("osascript", ["-e", appleScript]);

        process.on("close", (code: number) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`AppleScript failed with code ${code}`));
          }
        });

        process.on("error", (error: Error) => {
          reject(error);
        });
      });
    }

    await showToast({
      style: Toast.Style.Success,
      title: "Files Renamed",
      message: `Successfully renamed ${operations.length} file(s)`,
    });

    return true;
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Rename Failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}
