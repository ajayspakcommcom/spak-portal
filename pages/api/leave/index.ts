import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Leave = { id: ObjectId; title: string; reason: string; date: Date; };

type AdminLeaveNotification = { leaveId: ObjectId; refId: string, createdDate: Date };

type ApiResponse = | { message: string } | Leave | Leave[] | { data: any } | { error: string };

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

              console.log('3');

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

              console.log('2');

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({
                refId: req.body.refId,
                startDate: { $gte: req.body.filterStartDate, $lte: req.body.filterEndDate }
              }).toArray();
              res.status(200).json(data);

            } else if (req.body.status) {

              console.log('1');

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({
                refId: req.body.refId,
                isApproved: req.body.status
              }).toArray();
              res.status(200).json(data);

            } else {

              console.log('all');

              const client = await clientPromise;
              const db = client.db("Spak");
              const collection = db.collection<Leave>("leave");
              const data = await collection.find({ refId: req.body.refId }).sort({ createdDate: -1 }).toArray();
              res.status(200).json(data);

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

            console.log(req.body);

            req.body.createdDate = new Date().toString();
            const result = await collection.insertOne(req.body);

            const leaveCollection = db.collection<AdminLeaveNotification>("adminLeaveNotification");

            const leaveNotificationObj: AdminLeaveNotification = { leaveId: new ObjectId(), refId: '', createdDate: new Date() };

            leaveNotificationObj.leaveId = result.insertedId;
            leaveNotificationObj.refId = req.body.refId;

            await leaveCollection.insertOne(leaveNotificationObj);

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
            const result = await collection.replaceOne({ _id: new ObjectId(req.body.id) }, req.body);
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
