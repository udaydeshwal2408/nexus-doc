import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { processDocument, queryDocument } from '../services/vectorStore.js';

const router = express.Router();

// Setup Multer for PDF uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        await processDocument(req.file.path);
        
        // Clean up the uploaded file after processing
        fs.unlinkSync(req.file.path);
        
        return res.json({ message: 'Document processed and indexed successfully.' });
    } catch (error) {
        console.error('Error in /upload:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

router.post('/query', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const answer = await queryDocument(question);
        return res.json({ answer });
    } catch (error) {
        console.error('Error in /query:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

export default router;
