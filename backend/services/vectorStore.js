import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { runGraph } from "./ragGraph.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Pinecone Client Core
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const processDocument = async (filePath) => {
    try {
        console.log("Loading document...");
        const loader = new PDFLoader(filePath, { splitPages: false });
        const docs = await loader.load();
        
        console.log("Splitting document...");
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await textSplitter.splitDocuments(docs);
        
        console.log("Generating embeddings and syncing to remote Pinecone Index...");
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "gemini-embedding-2", 
        });

        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

        // Upload into Vector DB
        await PineconeStore.fromDocuments(splitDocs, embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });
        
        console.log("Document securely synced to Pinecone Backend.");
    } catch (e) {
        console.error("Error processing document into Pinecone:", e);
        throw e;
    }
};

export const queryDocument = async (question) => {
    // Execute Langgraph flow
    const response = await runGraph(question);
    return response;
};
