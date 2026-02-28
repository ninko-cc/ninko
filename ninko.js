import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default {
    THUMBNAIL_SUFFIX: '-thumbnail',

    addSuffix(filePath) {
        const { dir, name, ext } = path.parse(filePath);
        return path.join(dir, `${name}${this.THUMBNAIL_SUFFIX}${ext}`);
    },

    async resize(inputPath, outputPath, width, height, format, quality, animated) {
        if (fs.existsSync(outputPath)) return;

        const s = sharp(inputPath, { animated: animated });
        const meta = await s.metadata();

        if (width < meta.width && height < meta.height) {
            console.log(`[ninko] Resizing ${outputPath} from ${inputPath}`);
            await s.resize(width, height).toFormat(format, { quality: quality }).toFile(outputPath);
            return;
        }

        console.log(`[ninko] Copying ${outputPath} from ${inputPath}`);
        await fs.promises.copyFile(inputPath, outputPath);
    },
};
