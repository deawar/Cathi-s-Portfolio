import sharp from "sharp";

export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const { width = 800, height = 600 } = await image.metadata();

  const fontSize = Math.max(18, Math.round(width * 0.025));
  const text = "© Cathi Warren";

  // Build a repeated diagonal watermark SVG overlay
  const svgLines: string[] = [];
  const step = Math.round(fontSize * 6);
  const diagonal = Math.sqrt(width * width + height * height);
  const count = Math.ceil(diagonal / step) + 4;
  const cx = width / 2;
  const cy = height / 2;

  for (let i = -count; i <= count; i++) {
    const offset = i * step;
    svgLines.push(
      `<text x="${cx}" y="${cy + offset}" transform="rotate(-35, ${cx}, ${cy + offset})"
        font-size="${fontSize}" fill="white" fill-opacity="0.30"
        font-family="Arial, sans-serif" font-weight="bold"
        text-anchor="middle">${text}</text>`,
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="none"/>
    ${svgLines.join("\n")}
  </svg>`;

  const overlay = Buffer.from(svg);

  return image
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toBuffer();
}
