import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Leave = { id: ObjectId; title: string; reason: string; date: Date; };

type ApiResponse = | { message: string } | Leave | Leave[] | { data: any } | { error: string };

type User = { id: ObjectId; firstName: string; lastName: string; username: string; password: string; imgUrl: string; date: Date, designation: string };

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

        case 'LIST':
          try {

            if (req.body.status && req.body.filterStartDate && req.body.filterEndDate) {
              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({
                refId: req.body.refId,
                isApproved: req.body.status,
                startDate: { $gte: req.body.filterStartDate, $lte: req.body.filterEndDate }
              }).toArray();
              res.status(200).json(data);

            } else if (req.body.filterStartDate && req.body.filterEndDate) {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({
                refId: req.body.refId,
                startDate: { $gte: req.body.filterStartDate, $lte: req.body.filterEndDate }
              }).toArray();
              res.status(200).json(data);

            } else if (req.body.status) {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({
                refId: req.body.refId,
                isApproved: req.body.status
              }).toArray();
              res.status(200).json(data);

            } else {

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({}).sort({ createdDate: -1 }).toArray();

              const userCollection = db.collection<User>("user");
              const userData = await userCollection.find({}).toArray();

              userData.map((item: any) => {
                item._id = item._id.toString();
                delete item.uploadDocument;
                delete item.imgUrl;
                return {
                  _id: item._id,
                  firstName: item.firstName,
                  lastName: item.lastName,
                  username: item.username,
                }
              });

              const output: any[] = [];

              data.forEach((vItem: any, idx) => {
                const user = userData.find(item => vItem.refId === item._id);
                output.push({ ...user, ...vItem });

              });
              res.status(200).json(output);
            }
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'DETAIL':
          const { id } = req.body;
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Leave>("leave");
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
          break;

        case 'CREATE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Leave>("leave");
            const result = await collection.insertOne(req.body);
            res.status(200).json({ data: result });
          } catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        case 'UPDATE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<Leave>("leave");

            // const result = await collection.replaceOne({ _id: new ObjectId(req.body.id) }, req.body);

            const result = await collection.updateOne(
              { _id: new ObjectId(req.body.id) },
              { $set: { isApproved: req.body.approvalStatus === 'APPROVED' ? ApprovalStatus.Approved : ApprovalStatus.Rejected } }
            );

            res.status(200).json({ data: result });
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
            const collection = db.collection<Leave>("leave");
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
