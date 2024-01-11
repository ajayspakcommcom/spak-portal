import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Voucher = { id: ObjectId; voucherNo: string; person: string; amount: number; date: Date; summary: string };

type Holiday = { id: ObjectId; title: string; date: number; };

type Leave = { id: ObjectId; title: string; reason: string; date: Date; };

type Task = { _id: ObjectId; clientName: string; username: string; taskName: string; taskDescription: string; startDate: Date; endDate: Date; status: string; deadLine: string; imageDataUrl: string; };

type User = { id: ObjectId; firstName: string; lastName: string; username: string; password: string; imgUrl: string; date: Date, designation: string };

type Report = { _id: ObjectId; createdDate: Date; refId: string; reportData: { date: Date, detail: string, clientName: string } };

type ApiResponse = | { message: string } | Voucher | Voucher[] | Holiday | Holiday[] | Leave | Leave[] | Task | Task[] | User | User[] | Report[] | { data: any } | { error: string };

const cors = Cors({
  // Only allow requests with GET, POST and OPTIONS
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {

  await runMiddleware(req, res, cors);

  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {

    if (req.method === 'POST') {

      switch (req.body.type) {

        case 'VOUCHER_LIST':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Voucher>("voucher");
            const data = await collection.find({}).limit(4).toArray();
            res.status(200).json(data);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'HOLIDAY_LIST':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Holiday>("holiday");
            const data = await collection.find({}).limit(3).toArray();
            res.status(200).json(data);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'LEAVE_LIST':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Leave>("leave");
            const data = await collection.find({}).limit(3).toArray();
            res.status(200).json(data);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'REPORT_LIST':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Report>("report");
            const data = await collection.find({}).limit(3).toArray();
            res.status(200).json(data);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'TASK_LIST':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Task>("task");
            const data = await collection.find({}).limit(5).toArray();
            res.status(200).json(data);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'USER_LIST':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<User>("user");
            const data = await collection.find({}).limit(3).toArray();
            res.status(200).json(data);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        default:
          res.status(500).json({ data: '' });
      }
    }

    res.status(500).json({ data: 'Not Data Found' });
  }
}
