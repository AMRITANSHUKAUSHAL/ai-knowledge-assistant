const initializeVectorStore = require("../config/chroma");

const geminiModel = require("../services/geminiService");

const askQuestion = async (req, res) => {

    try {

        console.log("===== CHAT API =====");

        const { question } = req.body;

        if (!question) {

            return res.status(400).json({
                message: "Question Is Required",
            });
        }

        console.log("1 - Question Received");

        // Initialize Chroma
        const vectorStore = await initializeVectorStore();

        console.log("2 - Chroma Initialized");

        // Similarity Search
        const results = await vectorStore.similaritySearch(
            question,
            1
        );

        console.log("3 - Similarity Search Completed");

        console.log(results);

        // Build Context
        const context = results
            .map((doc) => doc.pageContent)
            .join("\n")
            .slice(0, 1500);

        console.log("4 - Context Created");

        // Prompt
        const prompt = `
        Answer ONLY from the provided context.

        Context:
        ${context}

        Question:
        ${question}
        `;

        console.log("5 - Sending To Gemini");

        // Generate Response
        const response = await geminiModel.invoke(prompt);

        console.log("6 - Response Received");

        return res.status(200).json({
            answer: response.content,
        });

    } catch (error) {

        console.log("===== ERROR =====");

        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    askQuestion,
};