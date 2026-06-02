import sharp from "sharp";

type OptimizedImage = {
  buffer: Buffer;
  contentType: string;
  ext: string;
};

const PRESETS = {
  vehicle: {
    width: 1400,
    quality: 82,
  },
} as const;

type ImagePreset = keyof typeof PRESETS;

export async function optimizeImageFile(
  file: File,
  preset: ImagePreset = "vehicle",
): Promise<OptimizedImage> {
  const input = Buffer.from(await file.arrayBuffer());
  const { width, quality } = PRESETS[preset];

  const buffer = await sharp(input)
    .rotate()
    .resize({
      width,
      withoutEnlargement: true,
    })
    .jpeg({
      quality,
      mozjpeg: true,
    })
    .toBuffer();

  return {
    buffer,
    contentType: "image/jpeg",
    ext: "jpg",
  };
}
