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

export async function resizeImage(post, inputDir, outputDir) {
    resize(
        path.join(inputDir, post.data.image),
        path.join(outputDir, post.data.image),
        post.data.width,
        post.data.height,
        post.data.quality,
        post.data.animated,
        post.data.signature,
    );
}

export async function resizeThumbnail(post, inputDir, outputDir) {
    resize(
        path.join(inputDir, post.data.image),
        path.join(outputDir, post.data.thumbnail.image),
        post.data.thumbnail.width,
        post.data.thumbnail.height,
        post.data.thumbnail.quality,
        post.data.thumbnail.animated,
        post.data.thumbnail.signature,
    );
}
