import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

console.log('Environment variables:', {
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT,
    PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_API_MODEL: process.env.AI_API_MODEL,
});

export const config = {
    ai: {
        apiKey: process.env.AI_API_KEY || '',
        model: 'claude-3-opus-20240229',
        maxTokens: 2000,
        temperature: 0.7,
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY || '',
        environment: process.env.PINECONE_ENVIRONMENT || '',
        indexName: process.env.PINECONE_INDEX_NAME || '',
    },
    embedding: {
        dimension: 1536,
        chunkSize: 1000,
        chunkOverlap: 200,
    }
}; 