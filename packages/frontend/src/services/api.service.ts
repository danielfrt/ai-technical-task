import axios from 'axios';
import { QAResponse, DocumentUploadResponse } from '../types';

const API_URL = 'http://localhost:3000/api';

export const apiService = {
    async uploadDocument(file: File): Promise<DocumentUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post<DocumentUploadResponse>(
            `${API_URL}/qa/document`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },

    async uploadText(text: string, source: string): Promise<DocumentUploadResponse> {
        const response = await axios.post<DocumentUploadResponse>(
            `${API_URL}/qa/document`,
            { text, source }
        );

        return response.data;
    },

    async askQuestion(question: string): Promise<QAResponse> {
        const response = await axios.post<QAResponse>(
            `${API_URL}/qa/question`,
            { question }
        );

        return response.data;
    },
}; 