import { environment } from "@raycast/api";

export interface PDFTextResult {
  filePath: string;
  fileName: string;
  extractedText: string;
  error?: string;
}

/**
 * Executes a shell command
 */
async function executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const { spawn } = eval("require")("child_process");
    const process = spawn("sh", ["-c", command]);

    let stdout = "";
    let stderr = "";

    process.stdout?.on("data", (data: any) => {
      stdout += data.toString();
    });

    process.stderr?.on("data", (data: any) => {
      stderr += data.toString();
    });

    process.on("close", (code: number) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    process.on("error", (error: Error) => {
      reject(error);
    });
  });
}

/**
 * Extracts text from multiple PDF files using Vision Framework OCR
 */
export async function extractPDFTexts(filePaths: string[]): Promise<PDFTextResult[]> {
  const results: PDFTextResult[] = [];

  // Try multiple possible paths for the Swift script
  const possiblePaths = [
    `${environment.assetsPath}/../src/vision_ocr.swift`,
    `${environment.supportPath}/src/vision_ocr.swift`,
    `/Users/jost/workspace/jk/raycast-extensions/smart-rename/src/vision_ocr.swift`,
  ];

  console.log(possiblePaths);

  let swiftScriptPath = "";

  // Find the correct path
  for (const path of possiblePaths) {
    try {
      const { stdout } = await executeCommand(`test -f "${path}" && echo "exists"`);
      if (stdout.trim() === "exists") {
        swiftScriptPath = path;
        break;
      }
    } catch {
      // Continue to next path
    }
  }

  if (!swiftScriptPath) {
    return filePaths.map((filePath) => ({
      filePath,
      fileName: filePath.split("/").pop() || "",
      extractedText: "",
      error: "Swift script not found. Please ensure vision_ocr.swift is in the src directory.",
    }));
  }

  for (const filePath of filePaths) {
    const fileName = filePath.split("/").pop() || "";

    try {
      // Debug: Log the command being executed
      const command = `chmod +x "${swiftScriptPath}" && swift "${swiftScriptPath}" "${filePath}"`;
      console.log(`Executing command: ${command}`);

      // Make swift script executable and run it
      const { stdout, stderr } = await executeCommand(command);

      // Debug: Log the results
      console.log(`Swift script stdout: ${stdout}`);
      console.log(`Swift script stderr: ${stderr}`);

      if (stderr && stderr.includes("ERROR")) {
        results.push({
          filePath,
          fileName,
          extractedText: "",
          error: `Swift script error: ${stderr}`,
        });
      } else if (stdout.trim().startsWith("ERROR:")) {
        results.push({
          filePath,
          fileName,
          extractedText: "",
          error: stdout.trim(),
        });
      } else {
        results.push({
          filePath,
          fileName,
          extractedText: stdout.trim(),
        });
      }
    } catch (error) {
      console.log(`Exception caught: ${error}`);
      results.push({
        filePath,
        fileName,
        extractedText: "",
        error: `Failed to process PDF: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return results;
}

/**
 * Filters file paths to only include PDFs
 */
export function filterPDFFiles(filePaths: string[]): string[] {
  return filePaths.filter((filePath) => filePath.toLowerCase().endsWith(".pdf"));
}
