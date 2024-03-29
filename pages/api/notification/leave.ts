import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Leave = { _id: ObjectId; startDate: Date; endDate: Date; isApproved: string; refId: string, type: string };

type LeaveNotification = { id: ObjectId; leaveId: string; status: string; createdDate: Date, requestedDate: Date, refId: string };

type ApiResponse = | { message: string } | LeaveNotification | LeaveNotification[] | { data: any } | { error: string };


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

        case 'LEAVELIST':
          try {

            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<LeaveNotification>("leavenotification");
            const data = await collection.find({ refId: req.body.refId }).sort({ createdDate: -1 }).limit(4).toArray();
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

        case 'LEAVECREATE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<LeaveNotification>("leavenotification");
            delete req.body.type;

            const leaveCollection = db.collection<Leave>("leave");
            const leaveData = await leaveCollection.findOne({ _id: new ObjectId(req.body.leaveId) });

            req.body.requestedDate = leaveData?.startDate;
            req.body.refId = leaveData?.refId;
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

        case 'DELETE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<LeaveNotification>("leavenotification");
            const result = await collection.deleteOne({ _id: new ObjectId(req.body.id) });
            res.status(200).json({ data: result });
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
