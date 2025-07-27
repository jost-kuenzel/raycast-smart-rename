import {
  ActionPanel,
  Action,
  List,
  showToast,
  Toast,
  getSelectedFinderItems,
  closeMainWindow,
  showHUD,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { extractPDFTexts, filterPDFFiles, PDFTextResult } from "./utils/pdf-extractor";
import { generateFileName, executeRenames, RenameOperation } from "./utils/file-renamer";

interface FileRenameItem {
  id: string;
  originalPath: string;
  originalName: string;
  suggestedName: string;
  extractedText: string;
  error?: string;
}

export default function RenameFilesCommand() {
  const [items, setItems] = useState<FileRenameItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSelectedFiles() {
      try {
        setIsLoading(true);

        // Get selected files from Finder
        const selectedItems = await getSelectedFinderItems();

        if (selectedItems.length === 0) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No Files Selected",
            message: "Please select PDF files in Finder first",
          });
          return;
        }

        // Filter to only PDF files
        const pdfPaths = filterPDFFiles(selectedItems.map((item) => item.path));

        if (pdfPaths.length === 0) {
          await showToast({
            style: Toast.Style.Failure,
            title: "No PDF Files",
            message: "Please select PDF files in Finder",
          });
          return;
        }

        await showToast({
          style: Toast.Style.Animated,
          title: "Analyzing PDFs",
          message: `Processing ${pdfPaths.length} file(s)...`,
        });

        // Extract text from all PDFs
        const extractResults = await extractPDFTexts(pdfPaths);

        await showToast({
          style: Toast.Style.Animated,
          title: "Generating Names",
          message: "Using AI to analyze content...",
        });

        // Generate file rename suggestions using AI
        const renameItems: FileRenameItem[] = [];

        for (let i = 0; i < extractResults.length; i++) {
          const result = extractResults[i];
          let suggestedName = result.fileName;

          if (!result.error) {
            try {
              suggestedName = await generateFileName(result.extractedText, result.fileName);
            } catch (error) {
              console.error("AI filename generation failed:", error);
              // Keep original filename if AI fails
            }
          }

          renameItems.push({
            id: `item-${i}`,
            originalPath: result.filePath,
            originalName: result.fileName,
            suggestedName,
            extractedText: result.extractedText,
            error: result.error,
          });
        }

        setItems(renameItems);

        await showToast({
          style: Toast.Style.Success,
          title: "Analysis Complete",
          message: `Generated ${renameItems.length} suggestions`,
        });
      } catch (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadSelectedFiles();
  }, []);

  async function handleRenameAll() {
    try {
      const operations: RenameOperation[] = items
        .filter((item) => !item.error && item.suggestedName !== item.originalName)
        .map((item) => ({
          originalPath: item.originalPath,
          newPath: item.originalPath.replace(item.originalName, item.suggestedName),
          originalName: item.originalName,
          newName: item.suggestedName,
        }));

      if (operations.length === 0) {
        await showToast({
          style: Toast.Style.Failure,
          title: "No Renames Needed",
          message: "All files already have appropriate names",
        });
        return;
      }

      const success = await executeRenames(operations);

      if (success) {
        await showHUD("✅ Files renamed successfully");
        await closeMainWindow();
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Rename Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async function handleRenameOne(item: FileRenameItem) {
    if (item.error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Cannot Rename",
        message: item.error,
      });
      return;
    }

    try {
      const operation: RenameOperation = {
        originalPath: item.originalPath,
        newPath: item.originalPath.replace(item.originalName, item.suggestedName),
        originalName: item.originalName,
        newName: item.suggestedName,
      };

      const success = await executeRenames([operation]);

      if (success) {
        await showHUD(`✅ Renamed: ${item.suggestedName}`);
        await closeMainWindow();
      }
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Rename Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search files...">
      {items.length > 0 && (
        <List.Section title="Rename Suggestions">
          {items.map((item) => (
            <List.Item
              key={item.id}
              title={item.suggestedName}
              //subtitle={`Original: ${item.originalName}`}
              icon={item.error ? "❌" : item.suggestedName !== item.originalName ? "📝" : "✅"}
              accessories={[
                {
                  text: item.error
                    ? "Error"
                    : item.suggestedName === item.originalName
                      ? "No change"
                      : "Rename suggested",
                },
              ]}
              actions={
                <ActionPanel>
                  {!item.error && (
                    <>
                      <Action title="Rename This File" onAction={() => handleRenameOne(item)} icon="📝" />
                      <Action
                        title="Rename All Files"
                        onAction={handleRenameAll}
                        icon="🔄"
                        shortcut={{ modifiers: ["cmd"], key: "r" }}
                      />
                    </>
                  )}
                  <Action.CopyToClipboard
                    title="Copy Suggested Name"
                    content={item.suggestedName}
                    shortcut={{ modifiers: ["cmd"], key: "c" }}
                  />
                  {item.extractedText && (
                    <Action.CopyToClipboard
                      title="Copy Extracted Text"
                      content={item.extractedText}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                    />
                  )}
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      )}

      {!isLoading && items.length === 0 && (
        <List.EmptyView
          title="No PDF Files Selected"
          description="Please select PDF files in Finder and run this command again"
          icon="📄"
        />
      )}
    </List>
  );
}
