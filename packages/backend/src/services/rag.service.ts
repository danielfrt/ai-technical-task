import { aiService } from './ai.service';
import { pineconeService } from './pinecone.service';
import { QARequest, QAResponse } from '../types';

const CHUNK_SIZE = 100;
const CONFIDENCE_DECAY = 0.2;

interface DocumentChunk {
    id: string;
    text: string;
    metadata: {
        source: string;
        pageNumber: number;
    };
}

class RAGService {
    async processQuestion(request: QARequest): Promise<QAResponse> {
        try {
            const relevantChunks = await pineconeService.findSimilarChunks(request.question);

            if (!relevantChunks.length) {
                return {
                    answer: 'No relevant information found in the documents.',
                    relevantChunks: [],
                };
            }

            const context = relevantChunks
                .map(chunk => chunk.text)
                .join('\n\n');

            const aiResponse = await aiService.generateAnswer(request.question, context);

            return {
                answer: aiResponse.text,
                relevantChunks: relevantChunks.map((chunk, index) => ({
                    text: chunk.text,
                    source: chunk.metadata.source,
                    confidence: Math.max(0, 1 - (index * CONFIDENCE_DECAY)),
                })),
            };
        } catch (error) {
            throw new Error(`Failed to process question: ${error.message}`);
        }
    }

    async processDocument(text: string, source: string): Promise<void> {
        try {
            const chunks = this.splitTextIntoChunks(text);

            const chunkPromises = chunks.map((chunkText, index) => {
                const chunk: DocumentChunk = {
                    id: `${source}-${index}`,
                    text: chunkText,
                    metadata: {
                        source,
                        pageNumber: index + 1,
                    },
                };

                return pineconeService.upsertChunk(chunk);
            });

            await Promise.all(chunkPromises);
        } catch (error) {
            throw new Error(`Failed to process document: ${error.message}`);
        }
    }

    private splitTextIntoChunks(text: string): string[] {
        const words = text.split(/\s+/);
        const chunks: string[] = [];
        let currentChunk: string[] = [];

        for (const word of words) {
            currentChunk.push(word);

            if (currentChunk.length >= CHUNK_SIZE) {
                chunks.push(currentChunk.join(' '));
                currentChunk = [];
            }
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join(' '));
        }

        return chunks;
    }
}

export const ragService = new RAGService(); 