export interface DocumentChunk {
    id: string;
    text: string;
    metadata: {
        source: string;
        pageNumber?: number;
        topics?: string[];
    };
    embedding?: number[];
}

export interface QARequest {
    question: string;
    documentIds?: string[];
}

export interface QAResponse {
    answer: string;
    relevantChunks: {
        text: string;
        source: string;
        confidence: number;
    }[];
}

export interface AIResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
} 