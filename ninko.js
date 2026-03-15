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

    addSuffix(filePath, suffix = '_thumbnail') {
        return filePath.replace(/(\.[^.]+)$/, `${suffix}$1`);
    },

    async transform(inputPath, outputPath, width, height, quality = 70, animated = false, signature = false) {
        if (fs.existsSync(outputPath)) return;

        const { ext } = path.parse(outputPath);
        const format = ext.slice(1);

        let artwork = sharp(inputPath, { animated: animated });
        const meta = await artwork.metadata();

        if (meta.width <= width && meta.height <= height) {
            console.log(`[ninko] Copying ${outputPath} from ${inputPath}`);
            await fs.promises.copyFile(inputPath, outputPath);
        }

        console.log(`[ninko] Resizing ${outputPath} from ${inputPath}`);
        artwork.resize(width, height);

        if (signature) {
            artwork.composite([{ input: './images/signature/20260314_signature.webp', gravity: 'southeast' }]);
        }

        await artwork.toFormat(format, { quality: quality }).toFile(outputPath);
    },

    head(text, length = 30) {
        const head = text.replace(/<[^>]*>?/gm, '').slice(0, length);
        return head.length == length ? head.slice(0, -1) + '…' : head;
    },

    iso8601(date) {
        const formatter = new Intl.DateTimeFormat('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        return formatter.format(date).replaceAll('/', '-');
    },
};

function resize(inputPath, outputPath, signature = false) {
    ninko.transform(inputPath, outputPath, this.width, this.height, this.quality, this.animated, signature);
}

export default ninko;
