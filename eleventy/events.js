import fs from 'fs';
import path from 'path';
import downscale from './downscale.js';

export default {
    after: {
        downscale(inputDir, outputDir, signatureFile, posts) {
            fs.mkdirSync(outputDir, { recursive: true });

            posts.forEach((post) => {
                if (!post.data.downscale) return;

                downscale(
                    path.join(inputDir, post.data.image),
                    path.join(outputDir, post.data.image),
                    post.data.width,
                    post.data.height,
                    post.data.quality,
                    post.data.animated,
                    post.data.signature && signatureFile,
                );

                downscale(
                    path.join(inputDir, post.data.image),
                    path.join(outputDir, post.data.thumbnail.image),
                    post.data.thumbnail.width,
                    post.data.thumbnail.height,
                    post.data.thumbnail.quality,
                    post.data.thumbnail.animated,
                    post.data.thumbnail.signature && signatureFile,
                );
            });
        },
    },
};
