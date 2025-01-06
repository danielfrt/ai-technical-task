import { Pinecone, RecordMetadata, ScoredPineconeRecord } from '@pinecone-database/pinecone';
import { config } from '../config/config';
import { DocumentChunk } from '../types';
import { aiService } from './ai.service';

class PineconeService {
    private pinecone: Pinecone;
    private index: any;

    constructor() {
        try {
            this.pinecone = new Pinecone({
                apiKey: config.pinecone.apiKey,
            });
            this.index = this.pinecone.index(config.pinecone.indexName);
        } catch (error) {
            console.error('Failed to initialize Pinecone:', error);
            throw new Error('Pinecone initialization failed');
        }
    }

    async upsertChunk(chunk: DocumentChunk): Promise<void> {
        try {
            if (!chunk.embedding) {
                chunk.embedding = await aiService.generateEmbedding(chunk.text);
            }

            if (!chunk.embedding || chunk.embedding.length === 0) {
                throw new Error('Failed to generate embedding for chunk');
            }

            await this.index.upsert([{
                id: chunk.id,
                values: chunk.embedding,
                metadata: {
                    text: chunk.text,
                    ...chunk.metadata,
                },
            }]);
        } catch (error) {
            console.error('Failed to upsert chunk:', error);
            throw new Error(`Failed to upsert chunk: ${error.message}`);
        }
    }

    async findSimilarChunks(query: string, topK: number = 3): Promise<DocumentChunk[]> {
        try {
            const queryEmbedding = await aiService.generateEmbedding(query);

            if (!queryEmbedding || queryEmbedding.length === 0) {
                throw new Error('Failed to generate embedding for query');
            }

            const results = await this.index.query({
                vector: queryEmbedding,
                topK,
                includeMetadata: true,
                includeValues: false,
            });

            if (!results.matches || results.matches.length === 0) {
                return [];
            }

            return results.matches.map((match: ScoredPineconeRecord<RecordMetadata>) => {
                const metadata = match.metadata || {};
                return {
                    id: match.id,
                    text: metadata.text || '',
                    metadata: {
                        source: metadata.source || '',
                        pageNumber: metadata.pageNumber,
                        topics: Array.isArray(metadata.topics) ? metadata.topics : [],
                    },
                };
            });
        } catch (error) {
            console.error('Failed to find similar chunks:', error);
            throw new Error(`Failed to find similar chunks: ${error.message}`);
        }
    }

    async updateTopics(chunkId: string, topics: string[]): Promise<void> {
        try {
            const vector = await this.index.fetch([chunkId]);

            if (!vector || !vector.records || !vector.records[chunkId]) {
                throw new Error(`Chunk with id ${chunkId} not found`);
            }

            await this.index.update({
                id: chunkId,
                metadata: {
                    topics,
                },
            });
        } catch (error) {
            console.error('Failed to update topics:', error);
            throw new Error(`Failed to update topics: ${error.message}`);
        }
    }
}

export const pineconeService = new PineconeService(); 