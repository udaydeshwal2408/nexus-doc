import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

// Define the state for the LangGraph
const GraphState = Annotation.Root({
    question: Annotation(),
    context: Annotation(),
    answer: Annotation(),
});

// Retrieve Node connected to external Pinecone Database
const retrieveNode = async (state) => {
    console.log("---RETRIEVE CONTEXT FROM PINECONE---");
    const { question } = state;
    
    // Pinecone initialization
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: "gemini-embedding-2", 
    });

    // Mount to the remote index
    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex }
    );
    
    // Retrieve top 4 most similar chunks
    const retriever = vectorStore.asRetriever(4);
    const docs = await retriever.invoke(question);
    
    const contextStr = docs.map(doc => doc.pageContent).join("\n\n");
    return { context: contextStr };
};

// Generate Node
const generateNode = async (state) => {
    console.log("---GENERATE ANSWER---");
    const { question, context } = state;
    
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.3,
    });
    
    const template = `You are a helpful and accurate assistant. Use the following context from a provided document to answer the user's question. 
If the answer is not contained in the context, explicitly state "I don't know based on the provided document."

Context:
{context}

Question:
{question}

Answer:`;

    const prompt = PromptTemplate.fromTemplate(template);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    
    const answer = await chain.invoke({ question, context });
    return { answer };
};

export const runGraph = async (question) => {
    // Build the graph
    const workflow = new StateGraph(GraphState)
        .addNode("retrieve", retrieveNode)
        .addNode("generate", generateNode)
        .addEdge(START, "retrieve")
        .addEdge("retrieve", "generate")
        .addEdge("generate", END);
        
    const app = workflow.compile();
    
    // Execute the graph
    const inputs = { question };
    
    const result = await app.invoke(inputs);
    return result.answer;
};
