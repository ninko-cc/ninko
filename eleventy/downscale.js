import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async function downscale(inputPath, outputPath, width, height, quality, animated, signatureFile) {
    if (fs.existsSync(outputPath)) return;

    const { ext } = path.parse(outputPath);
    const format = ext.slice(1);

    let artwork = sharp(inputPath, { animated: animated });
    const meta = await artwork.metadata();

    if (meta.width <= width && meta.height <= height) {
        console.log(`[ninko] Copying ${outputPath} from ${inputPath}`);
        await fs.promises.copyFile(inputPath, outputPath);
        return;
    }

    console.log(`[ninko] Resizing ${outputPath} from ${inputPath}`);

    artwork.resize(width, height);

    if (signatureFile) artwork.composite([{ input: signatureFile, gravity: 'southeast' }]);

    await artwork.toFormat(format, { quality: quality }).toFile(outputPath);
}
