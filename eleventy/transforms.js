import { minify as _minifyHTML } from 'html-minifier-terser';
import { minify as _minifyXML } from 'minify-xml';

export default {
    async minifyHTML(content) {
        if ((this.page.outputPath || '').endsWith('.html')) {
            const cleanedContent = content.replace(/>\s*\n\s*/g, '>').replace(/\s*\n\s*</g, '<');
            return _minifyHTML(cleanedContent, {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: false,
                useShortDoctype: true,
                removeRedundantAttributes: true,
                removeComments: true,
            });
        }
        return content;
    },

    async minifyXML(content) {
        if ((this.page.outputPath || '').endsWith('.xml')) {
            return _minifyXML(content, {
                shortenNamespaces: false,
            });
        }
        return content;
    },

    async minifyJSON(content) {
        if ((this.page.outputPath || '').endsWith('.json')) {
            return JSON.stringify(JSON.parse(content));
        }
        return content;
    },
};
