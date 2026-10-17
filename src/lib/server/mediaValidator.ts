/**
 * Server-side media upload validator.
 * Validates file signatures (magic bytes), MIME types, and file size limits.
 * Prevents executable or malicious files disguised with an image extension.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export type SupportedExtension = "jpg" | "png" | "webp" | "avif";

export interface MediaValidationResult {
  valid: boolean;
  error?: string;
  extension?: SupportedExtension;
  mimeType?: string;
}

/**
 * Inspects buffer magic bytes to determine the true file format.
 */
export function detectImageSignature(buffer: Buffer): SupportedExtension | null {
  if (!buffer || buffer.length < 12) {
    return null;
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  // 3. WebP: bytes 0-3 "RIFF" and bytes 8-11 "WEBP"
  const riff = buffer.subarray(0, 4).toString("ascii");
  const webp = buffer.subarray(8, 12).toString("ascii");
  if (riff === "RIFF" && webp === "WEBP") {
    return "webp";
  }

  // 4. AVIF: bytes 4-7 "ftyp" and bytes 8-12 "avif" or "avis"
  const ftyp = buffer.subarray(4, 8).toString("ascii");
  if (ftyp === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii");
    if (brand === "avif" || brand === "avis" || brand === "mif1") {
      return "avif";
    }
  }

  return null;
}

/**
 * Validates an uploaded file buffer against declared content type and file size.
 */
export function validateImageUpload(
  buffer: Buffer,
  declaredContentType: string
): MediaValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "Empty upload payload." };
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: `File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB limit.`,
    };
  }

  const detectedExt = detectImageSignature(buffer);
  if (!detectedExt) {
    return {
      valid: false,
      error: "Invalid file signature. File is not a valid JPEG, PNG, WebP, or AVIF image.",
    };
  }

  const mimeMap: Record<SupportedExtension, string[]> = {
    jpg: ["image/jpeg", "image/jpg"],
    png: ["image/png"],
    webp: ["image/webp"],
    avif: ["image/avif"],
  };

  const allowedMimes = mimeMap[detectedExt];
  const declaredClean = (declaredContentType || "").toLowerCase().split(";")[0].trim();

  // If a Content-Type is provided, ensure it matches the true file signature
  if (declaredClean && !allowedMimes.includes(declaredClean)) {
    return {
      valid: false,
      error: `Content-Type mismatch: declared "${declaredClean}" but file data is "${detectedExt}".`,
    };
  }

  return {
    valid: true,
    extension: detectedExt,
    mimeType: allowedMimes[0],
  };
}
