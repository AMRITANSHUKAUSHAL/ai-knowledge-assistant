const fs = require("fs");
const pdfParse = require("pdf-parse");

const prisma = require("../config/prisma");

const chunkText = require("../utils/chunkText");

const initializeVectorStore = require("../config/chroma");

const uploadDocument = async (req, res) => {

    try {

        console.log("1 - Upload API Hit");

        if (!req.file) {

            return res.status(400).json({
                message: "No File Uploaded",
            });
        }

        console.log("2 - File Found");

        // Read PDF
        const databuffer = fs.readFileSync(req.file.path);

        console.log("3 - PDF Read Success");

        // Extract text
        const pdfData = await pdfParse(databuffer);

        console.log("4 - PDF Text Extracted");

        // Save in PostgreSQL
        const document = await prisma.document.create({
            data: {
                title: req.file.originalname,
                content: pdfData.text,
                filePath: req.file.path,
                userId: req.user.id
            }
        });

        console.log("5 - Document Saved In Database");

        // Create chunks
        const chunks = chunkText(pdfData.text);

        console.log("6 - Total Chunks:", chunks.length);

        console.log("7 - First Chunk:");

        console.log(chunks[0]);

        // Initialize Chroma
        const vectorStore = await initializeVectorStore();

        console.log("8 - Chroma Initialized");

        // Store in ChromaDB
        console.log("9 - Adding Documents To ChromaDB");

        await vectorStore.addDocuments(

            chunks.map((chunk) => ({
                pageContent: chunk,
                metadata: {
                    source: req.file.originalname,
                },
            }))
        );

        console.log("10 - Documents Stored In ChromaDB");

        return res.status(201).json({
            message: "Document Uploaded Successfully",
            document,
        });

    } catch (error) {

        console.log("===== UPLOAD ERROR =====");

        console.log(error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    uploadDocument,
};