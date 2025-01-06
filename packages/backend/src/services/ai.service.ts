import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/config';
import { AIResponse } from '../types';

class AIService {
    private anthropic: Anthropic;

    constructor() {
        this.anthropic = new Anthropic({
            apiKey: config.ai.apiKey,
        });
    }

    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const hash = Array.from(text).reduce((acc, char) => {
                return acc + char.charCodeAt(0);
            }, 0);

            const embedding = new Array(config.embedding.dimension).fill(0);
            for (let i = 0; i < config.embedding.dimension; i++) {
                embedding[i] = Math.sin(hash * (i + 1)) * 0.5 + 0.5;
            }

            return embedding;
        } catch (error) {
            throw new Error(`Failed to generate embedding: ${error.message}`);
        }
    }

    async generateAnswer(question: string, context: string): Promise<AIResponse> {
        try {
            const prompt = `
                Context: ${context}
                
                Question: ${question}
                
                Please provide a comprehensive answer based on the context provided. 
                If the context doesn't contain enough information to answer the question fully, 
                please indicate that in your response.
            `;

            const response = await this.anthropic.messages.create({
                model: 'claude-3-opus-20240229',
                max_tokens: config.ai.maxTokens,
                temperature: config.ai.temperature,
                messages: [
                    { role: 'user', content: prompt }
                ],
            });

            if (!response.content || response.content.length === 0) {
                throw new Error('Empty response from AI');
            }

            const content = response.content[0];
            const answer = content.type === 'text' ? content.text : 'Unable to generate response';

            return {
                text: answer,
                usage: {
                    promptTokens: response.usage?.input_tokens ?? 0,
                    completionTokens: response.usage?.output_tokens ?? 0,
                    totalTokens: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0),
                },
            };
        } catch (error) {
            throw new Error(`AI generation failed: ${error.message}`);
        }
    }
}

export const aiService = new AIService(); 