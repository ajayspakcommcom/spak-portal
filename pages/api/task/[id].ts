import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

    const user = verifyToken(req);

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        const { id } = req.query;
        try {
            const client = await clientPromise;
            const db = client.db("user");
            const collection = db.collection<Task>("tasks");
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