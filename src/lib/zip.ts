import { MarkdownDocument } from './types';

interface ExtractedZipData {
  markdownDocuments: MarkdownDocument[];
  assets: Record<string, string>; // e.g. "images/arch.png" -> "data:image/png;base64,..."
}

/**
 * Native ZIP parser utilizing DataView and DecompressionStream('deflate-raw')
 * Zero external npm dependencies required!
 */
export async function unpackZipArchive(arrayBuffer: ArrayBuffer): Promise<ExtractedZipData> {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const totalLength = bytes.length;

  const markdownDocs: MarkdownDocument[] = [];
  const assets: Record<string, string> = {};

  let offset = 0;
  let docIndex = 0;

  while (offset < totalLength - 4) {
    const signature = view.getUint32(offset, true);

    // Local file header signature: 0x04034b50
    if (signature !== 0x04034b50) {
      // If we encounter central directory header (0x02014b50) or end of central dir (0x06054b50), we are done with local file entries
      if (signature === 0x02014b50 || signature === 0x06054b50) {
        break;
      }
      offset++;
      continue;
    }

    const compressionMethod = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const uncompressedSize = view.getUint32(offset + 22, true);
    const fileNameLength = view.getUint16(offset + 26, true);
    const extraFieldLength = view.getUint16(offset + 28, true);

    const fileNameBytes = bytes.subarray(offset + 30, offset + 30 + fileNameLength);
    const fileName = new TextDecoder('utf-8').decode(fileNameBytes);

    const fileDataOffset = offset + 30 + fileNameLength + extraFieldLength;
    const compressedData = bytes.subarray(fileDataOffset, fileDataOffset + compressedSize);

    // Skip directories or system files (like __MACOSX)
    if (fileName.endsWith('/') || fileName.includes('__MACOSX') || fileName.startsWith('.')) {
      offset = fileDataOffset + compressedSize;
      continue;
    }

    let decompressedBytes: Uint8Array;

    try {
      if (compressionMethod === 0) {
        // Stored (no compression)
        decompressedBytes = compressedData;
      } else if (compressionMethod === 8) {
        // Deflate
        if (typeof DecompressionStream !== 'undefined') {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          writer.write(compressedData);
          writer.close();

          const reader = ds.readable.getReader();
          const chunks: Uint8Array[] = [];
          let totalBytes = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              totalBytes += value.length;
            }
          }

          decompressedBytes = new Uint8Array(totalBytes);
          let pos = 0;
          for (const chunk of chunks) {
            decompressedBytes.set(chunk, pos);
            pos += chunk.length;
          }
        } else {
          // Fallback or uncompressed
          decompressedBytes = compressedData;
        }
      } else {
        console.warn(`Unsupported compression method ${compressionMethod} for ${fileName}`);
        offset = fileDataOffset + compressedSize;
        continue;
      }

      // Check if Markdown file
      if (/\.(md|markdown|txt)$/i.test(fileName)) {
        const textContent = new TextDecoder('utf-8').decode(decompressedBytes);
        markdownDocs.push({
          id: `zip-doc-${docIndex++}`,
          filename: fileName,
          content: textContent,
          order: docIndex,
          size: decompressedBytes.byteLength,
        });
      }
      // Check if Image asset
      else if (/\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(fileName)) {
        const mimeType = getMimeTypeFromFilename(fileName);
        const base64Str = uint8ArrayToBase64(decompressedBytes);
        const dataUri = `data:${mimeType};base64,${base64Str}`;

        // Store multiple normalized paths (e.g. "images/img.png", "./images/img.png", "img.png")
        assets[fileName] = dataUri;
        assets[`./${fileName}`] = dataUri;
        const baseNameOnly = fileName.split('/').pop() || fileName;
        assets[baseNameOnly] = dataUri;
        assets[`./${baseNameOnly}`] = dataUri;
      }
    } catch (err) {
      console.warn(`Failed to decompress file ${fileName}:`, err);
    }

    offset = fileDataOffset + compressedSize;
  }

  // Sort markdown docs naturally (e.g. README.md first or alphabetically)
  markdownDocs.sort((a, b) => {
    const isAReadme = /readme/i.test(a.filename);
    const isBReadme = /readme/i.test(b.filename);
    if (isAReadme && !isBReadme) return -1;
    if (!isAReadme && isBReadme) return 1;
    return a.filename.localeCompare(b.filename, undefined, { numeric: true });
  });

  // Re-assign order numbers
  markdownDocs.forEach((doc, idx) => {
    doc.order = idx + 1;
  });

  return {
    markdownDocuments: markdownDocs,
    assets,
  };
}

function getMimeTypeFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'svg':
      return 'image/svg+xml';
    case 'bmp':
      return 'image/bmp';
    case 'ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof btoa !== 'undefined') {
    return btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}
