const { Embeddings } = require("@langchain/core/embeddings");

const { pipeline } = require("@xenova/transformers");

class HuggingFaceEmbeddings extends Embeddings {

    constructor() {
        super();
        this.extractor = null;
    }

    async loadModel() {

        if (!this.extractor) {

            this.extractor = await pipeline(
                "feature-extraction",
                "Xenova/all-MiniLM-L6-v2"
            );
        }

        return this.extractor;
    }

    async embedDocuments(texts) {

        const model = await this.loadModel();

        const embeddings = [];

        for (const text of texts) {

            const output = await model(text, {
                pooling: "mean",
                normalize: true,
            });

            embeddings.push(Array.from(output.data));
        }

        return embeddings;
    }

    async embedQuery(text) {

        const model = await this.loadModel();

        const output = await model(text, {
            pooling: "mean",
            normalize: true,
        });

        return Array.from(output.data);
    }
}

module.exports = HuggingFaceEmbeddings;