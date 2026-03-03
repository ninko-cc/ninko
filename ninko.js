import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ninko = {
    artwork: {
        width: 640,
        height: 800,
        quality: 100,
        resize: resize,
        thumbnail: {
            width: 300,
            height: 375,
            resize: resize,
        },
    },
    doodle: {
        thumbnail: {
            width: 300,
            height: 300,
            resize: resize,
        },
    },
    animation: {
        thumbnail: {
            width: 300,
            height: 300,
            animated: true,
            resize: resize,
        },
    },

    addSuffix(filePath, suffix = '-thumbnail') {
        return filePath.replace(/(\.[^.]+)$/, `${suffix}$1`);
    },

    async transform(inputPath, outputPath, width, height, quality = 70, animated = false) {
        if (fs.existsSync(outputPath)) return;

        const { ext } = path.parse(outputPath);
        const format = ext.slice(1);

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

    head(text, length = 30) {
        const head = text.replace(/<[^>]*>?/gm, '').slice(0, length);
        return head.length == length ? head.slice(0, -1) + '…' : head;
    },
};

function resize(inputPath, outputPath) {
    ninko.transform(inputPath, outputPath, this.width, this.height, this.quality, this.animated);
}

export default ninko;
