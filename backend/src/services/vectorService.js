const { pipeline } = require("@xenova/transformers");

let extractor;

const loadModel = async () => {

    if (!extractor) {

        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }

    return extractor;
};

const createEmbeddings = async (text) => {

    const model = await loadModel();

    const output = await model(String(text), {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data);
};

module.exports = {
    createEmbeddings,
};