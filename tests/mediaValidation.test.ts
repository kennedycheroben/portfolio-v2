import { describe, it, expect } from "vitest";
import {
  detectImageSignature,
  validateImageUpload,
  MAX_IMAGE_BYTES,
} from "../src/lib/server/mediaValidator";

describe("Media Validation & File Signature Checks", () => {
  it("correctly identifies JPEG magic bytes", () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    expect(detectImageSignature(jpegBuffer)).toBe("jpg");
  });

  it("correctly identifies PNG magic bytes", () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    expect(detectImageSignature(pngBuffer)).toBe("png");
  });

  it("correctly identifies WebP magic bytes", () => {
    const webpHeader = Buffer.alloc(16);
    webpHeader.write("RIFF", 0, "ascii");
    webpHeader.writeUInt32LE(100, 4);
    webpHeader.write("WEBP", 8, "ascii");
    expect(detectImageSignature(webpHeader)).toBe("webp");
  });

  it("correctly identifies AVIF magic bytes", () => {
    const avifHeader = Buffer.alloc(16);
    avifHeader.writeUInt32BE(16, 0);
    avifHeader.write("ftyp", 4, "ascii");
    avifHeader.write("avif", 8, "ascii");
    expect(detectImageSignature(avifHeader)).toBe("avif");
  });

  it("rejects non-image payloads such as shell scripts, text, or HTML", () => {
    const textBuffer = Buffer.from("<!DOCTYPE html><html><body>malicious script</body></html>");
    expect(detectImageSignature(textBuffer)).toBeNull();

    const bashBuffer = Buffer.from("#!/bin/bash\necho 'danger'");
    expect(detectImageSignature(bashBuffer)).toBeNull();

    const phpBuffer = Buffer.from("<?php echo 'execute'; ?>");
    expect(detectImageSignature(phpBuffer)).toBeNull();
  });

  it("rejects uploads exceeding the 5MB size limit", () => {
    const largeBuffer = Buffer.alloc(MAX_IMAGE_BYTES + 1024);
    // Even if it has valid JPEG header
    largeBuffer[0] = 0xff;
    largeBuffer[1] = 0xd8;
    largeBuffer[2] = 0xff;

    const res = validateImageUpload(largeBuffer, "image/jpeg");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("exceeds the 5 MB limit");
  });

  it("rejects MIME type mismatches (e.g. declared PNG but file is JPEG)", () => {
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    const res = validateImageUpload(jpegBuffer, "image/png");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Content-Type mismatch");
  });

  it("accepts valid matching image uploads", () => {
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    const res = validateImageUpload(pngBuffer, "image/png");
    expect(res.valid).toBe(true);
    expect(res.extension).toBe("png");
    expect(res.mimeType).toBe("image/png");
  });
});
