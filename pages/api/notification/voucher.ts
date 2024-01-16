import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Voucher = { id: ObjectId; voucherNo: number; person: string; amount: number; date: Date; summary: string };

type VoucherNotification = { id: ObjectId; leaveId: string; status: string; createdDate: Date, startDate: Date };

type ApiResponse = | { message: string } | VoucherNotification | VoucherNotification[] | { data: any } | { error: string };


enum ApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

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

        case 'VOUCHERLIST':
          try {

            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<VoucherNotification>("vouchernotification");
            const data = await collection.find({}).sort({ createdDate: -1 }).limit(4).toArray();
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

        case 'VOUCHERCREATE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<VoucherNotification>("vouchernotification");
            delete req.body.type;

            const voucherCollection = db.collection<Voucher>("voucher");
            const voucherData = await voucherCollection.findOne({ _id: new ObjectId(req.body.voucherId) });

            req.body.startDate = voucherData?.date;
            const data = await collection.insertOne(req.body);

            res.status(200).json({ data: data });
          } catch (err) {
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
