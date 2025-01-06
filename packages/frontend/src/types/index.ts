export interface QAResponse {
    answer: string;
    relevantChunks: {
        text: string;
        source: string;
        confidence: number;
    }[];
}

export interface DocumentUploadResponse {
    message: string;
}

export interface ProcessingStatus {
    status: 'idle' | 'processing' | 'success' | 'error';
    message?: string;
} 