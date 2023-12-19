import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Task = {
    _id: ObjectId;
    clientName: string;
    username: string;
    taskName: string;
    taskDescription: string;
    startDate: Date;
    endDate: Date;
    status: string;
    deadLine: string;
    imageDataUrl: string;
};

type ApiResponse = | { message: string } | Task | Task[] | { id: any } | { error: string };

const cors = Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

    // console.log('Manish');
    // res.status(500).json({ message: 'Ram' });

    await runMiddleware(req, res, cors);

    const user = verifyToken(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        const { id } = req.query;
        try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Task>("task");
            const item = await collection.findOne({ _id: new ObjectId(id?.toString()) });

            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.status(200).json(item);
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(500).json({ error: 'An unknown error occurred' });
            }
        }
    }

}