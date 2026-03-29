import fs from 'fs';
import path from 'path';
import { resizeImage, resizeThumbnail } from './resize.js';

export default {
    after(directories, posts) {
        const inputDir = './images/artworks';
        const outputDir = path.join(directories.output, inputDir);

        fs.mkdirSync(outputDir, { recursive: true });

        posts.forEach((post) => {
            if (post.data.category == 'textonly') return;
            resizeImage(post, inputDir, outputDir);
            resizeThumbnail(post, inputDir, outputDir);
        });
    },
};
