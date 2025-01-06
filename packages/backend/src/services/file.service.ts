import fs from 'fs/promises';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import pdfParse from 'pdf-parse';
import { Request } from 'express';

type MulterFile = Express.Multer.File;

const storage = multer.diskStorage({
    destination: async (req: Request, file: MulterFile, cb: (error: Error | null, destination: string) => void) => {
        try {
            const uploadDir = path.join(__dirname, '../uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error as Error, '');
        }
    },
    filename: (req: Request, file: MulterFile, cb: (error: Error | null, filename: string) => void) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    },
});

export const upload = multer({
    storage,
    fileFilter: (req: Request, file: MulterFile, cb: FileFilterCallback) => {
        const allowedTypes = ['application/pdf', 'text/plain'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and TXT files are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

interface ProcessedFile {
    text: string;
    source: string;
}

export const fileService = {
    async processFile(file: MulterFile): Promise<ProcessedFile> {
        const filePath = file.path;
        let text = '';

        try {
            if (file.mimetype === 'application/pdf') {
                const dataBuffer = await fs.readFile(filePath);
                const pdfData = await pdfParse(dataBuffer);
                text = pdfData.text;
            } else if (file.mimetype === 'text/plain') {
                text = await fs.readFile(filePath, 'utf-8');
            }

            await fs.unlink(filePath);

            return {
                text: text.trim(),
                source: path.basename(file.originalname, path.extname(file.originalname)),
            };
        } catch (error) {
            try {
                await fs.unlink(filePath);
            } catch (e) {
                console.error('Error deleting temporary file:', e);
            }
            throw new Error(`File processing failed: ${error.message}`);
        }
    },
}; 