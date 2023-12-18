import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

const product = path.join(process.cwd(), 'data/product.json');

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
    try {
        const data = fs.readFileSync(product, 'utf-8');
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}