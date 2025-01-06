import { Request, Response } from 'express';
import { ragService } from '../services/rag.service';
import { fileService } from '../services/file.service';
import { QARequest } from '../types';

export const qaController = {
    async askQuestion(req: Request, res: Response) {
        try {
            const question: QARequest = req.body;

            if (!question.question) {
                return res.status(400).json({ error: 'Question is required' });
            }

            const answer = await ragService.processQuestion(question);
            res.json(answer);
        } catch (error) {
            console.error('Error processing question:', error);
            res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
        }
    },

    async processDocument(req: Request, res: Response) {
        try {
            console.log('Processing document request:', req.body);

            if (req.file) {
                const { text, source } = await fileService.processFile(req.file);
                await ragService.processDocument(text, source);
                return res.json({ message: 'Document processed successfully' });
            }

            // Обработка текста
            const { text, source } = req.body;
            if (!text || !source) {
                return res.status(400).json({ error: 'Text and source are required' });
            }

            await ragService.processDocument(text, source);
            res.json({ message: 'Document processed successfully' });
        } catch (error) {
            console.error('Error processing document:', error);
            res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' });
        }
    },
}; 