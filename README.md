# KnowledgeLens Q&A System 🧠📄

KnowledgeLens is a full-stack, AI-powered document Question and Answer application. It allows users to seamlessly upload PDF documents and interactively query their content leveraging an advanced RAG (Retrieval-Augmented Generation) pipeline.

## 🚀 Features
- **Intelligent RAG Pipeline:** Context retrieval and answer generation powered by LangGraph state machines.
- **Persistent Context:** Integrates securely with **Pinecone Vector Database** for lightning-fast, persistent document semantic search.
- **Google GenAI Backend:** Utilizes state-of-the-art `gemini-embedding-2` for creating 768-dimensional document footprints, and `gemini-2.5-flash` for the primary conversation engine.
- **Premium User Interface:** Constructed using React and Redux, featuring a polished dark mode, glassmorphism aesthetics, responsive styling, and native markdown parsing.

## 🛠️ Technology Stack
- **Frontend:** React, Redux Toolkit, Vite, React-Markdown
- **Backend:** Node.js, Express.js, Multer
- **AI Core:** `@langchain/google-genai`, `@langchain/langgraph`, `@langchain/pinecone`
- **Database:** Pinecone Serverless Vector DB

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js installed
- A Google API Key ([Google AI Studio](https://aistudio.google.com/))
- A Pinecone API Key ([Pinecone Console](https://app.pinecone.io/))

### 1. Clone the repository
```bash
git clone https://github.com/udaydeshwal2408/nexus-doc.git
cd nexus-doc
```

### 2. Configure Backend
Navigate to the backend and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your keys:
```env
PORT=5000
GOOGLE_API_KEY="your-google-gemini-key"
PINECONE_API_KEY="your-pinecone-api-key"
PINECONE_INDEX_NAME="nexus-doc-index"
```
*(Note: Ensure your Pinecone index is configured with 768 dimensions using the `cosine` metric).*

Run the server:
```bash
node server.js
```

### 3. Configure Frontend
Open a new terminal and install frontend dependencies:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

### 4. Usage
Navigate to `http://localhost:5173` in your browser. Drag and drop any PDF into the uploader panel to index it across the Pinecone cloud. Once indexing completes, you can chat continuously with the document!

## 📜 License
MIT License
