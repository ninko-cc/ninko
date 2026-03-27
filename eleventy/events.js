import fs from 'fs';
import path from 'path';
import { resizeImage, resizeThumbnail } from './resize.js';

export default {
    after(directories, posts) {
        const inputDir = './images/artworks';
        const outputDir = path.join(directories.output, inputDir);

        fs.mkdirSync(outputDir, { recursive: true });

        posts.forEach((post) => {
            switch (post.data.category) {
                case 'fanart':
                case 'original':
                case 'study':
                    resizeImage(post, inputDir, outputDir);
                    resizeThumbnail(post, inputDir, outputDir);
                    break;

                case 'doodle':
                    resizeThumbnail(post, inputDir, outputDir);
                    break;

                case 'animation':
                    resizeThumbnail(post, inputDir, outputDir);
                    break;
            }
        });
    },
};
