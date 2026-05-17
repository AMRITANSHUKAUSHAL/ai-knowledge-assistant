const { ChromaClient } = require("chromadb");

const { Chroma } = require("@langchain/community/vectorstores/chroma");

const HuggingFaceEmbeddings = require("../services/huggingFaceEmbeddings");

const embeddings = new HuggingFaceEmbeddings();

const client = new ChromaClient({
    path: "http://localhost:8000",
});

const initializeVectorStore = async () => {

    return await Chroma.fromExistingCollection(
        embeddings,
        {
            collectionName: "documents",
            client,
        }
    );
};

module.exports = initializeVectorStore;