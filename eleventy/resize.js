import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function resize(inputPath, outputPath, width, height, quality, animated, signature) {
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

    if (signature) {
        artwork.composite([{ input: './images/signature/20260314_signature.webp', gravity: 'southeast' }]);
    }

    await artwork.toFormat(format, { quality: quality }).toFile(outputPath);
}

export default resize;
