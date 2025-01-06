import { makeAutoObservable, runInAction } from 'mobx';
import { apiService } from '../services/api.service';
import { ProcessingStatus, QAResponse } from '../types';

class QAStore {
    processingStatus: ProcessingStatus = { status: 'idle' };
    currentAnswer: QAResponse | null = null;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async uploadDocument(file: File) {
        try {
            this.setProcessingStatus({ status: 'processing', message: 'Uploading document...' });
            await apiService.uploadDocument(file);
            runInAction(() => {
                this.setProcessingStatus({ status: 'success', message: 'Document uploaded successfully' });
            });
        } catch (error) {
            runInAction(() => {
                this.setProcessingStatus({
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Error uploading document'
                });
            });
        }
    }

    async uploadText(text: string, source: string) {
        try {
            this.setProcessingStatus({ status: 'processing', message: 'Processing text...' });
            await apiService.uploadText(text, source);
            runInAction(() => {
                this.setProcessingStatus({ status: 'success', message: 'Text processed successfully' });
            });
        } catch (error) {
            runInAction(() => {
                this.setProcessingStatus({
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Error processing text'
                });
            });
        }
    }

    async askQuestion(question: string) {
        try {
            this.setProcessingStatus({ status: 'processing', message: 'Getting answer...' });
            const response = await apiService.askQuestion(question);
            runInAction(() => {
                this.currentAnswer = response;
                this.setProcessingStatus({ status: 'success' });
            });
        } catch (error) {
            runInAction(() => {
                this.setProcessingStatus({
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Error getting answer'
                });
            });
        }
    }

    setProcessingStatus(status: ProcessingStatus) {
        this.processingStatus = status;
    }

    clearAnswer() {
        this.currentAnswer = null;
    }

    clearError() {
        this.error = null;
    }
}

export const qaStore = new QAStore(); 