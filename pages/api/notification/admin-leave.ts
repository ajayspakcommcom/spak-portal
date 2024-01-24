import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Leave = { _id: ObjectId; startDate: Date; endDate: Date; isApproved: string; refId: string, type: string };

type User = { _id: ObjectId, firstName: string, lastName: string, username: string, password: string, imgUrl: string, date: Date, designation: '', doj: string, uploadDocument: string };

type AdminLeaveNotification = { id: ObjectId; leaveId: string; status: string; createdDate: Date, requestedDate: Date, refId: string };

type ApiResponse = | { message: string } | AdminLeaveNotification | AdminLeaveNotification[] | { data: any } | { error: string };


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
            const collection = db.collection<AdminLeaveNotification>("adminLeaveNotification");
            const data = await collection.find({}).sort({ createdDate: -1 }).toArray();

            const leaveCollection = db.collection<Leave>("leave");
            const leaveData = await leaveCollection.find({}).toArray();

            const leaveOutput: any[] = [];

            data.forEach((item, indx) => {
              const result = leaveData.find((lItem) => item.leaveId.toString() === lItem._id.toString());
              if (result) {
                leaveOutput.push({ ...result, notificationId: item._id });
              }
            });

            // console.log('data', data);
            // console.log('leaveData', leaveData);
            // console.log('leaveOutput', leaveOutput);

            const userCollection = db.collection<User>("user");
            const userData = await userCollection.find({}).toArray();

            const finalOutput: any[] = [];

            leaveOutput.forEach((item, indx) => {
              const user = userData.find((uItem) => uItem._id.toString() === item.refId.toString());
              //console.log('final Data', user);
              if (user) {
                finalOutput.push({ user: user, leave: item });
              }
            });

            res.status(200).json(finalOutput);
          }
          catch (err) {
            if (err instanceof Error) {
              res.status(500).json({ error: err.message });
            } else {
              res.status(500).json({ error: 'An unknown error occurred' });
            }
          }
          break;

        // case 'LEAVECREATE':
        //   try {
        //     const client = await clientPromise;
        //     const db = client.db("Spak");
        //     const collection = db.collection<AdminLeaveNotification>("adminLeaveNotification");
        //     delete req.body.type;

        //     const leaveCollection = db.collection<Leave>("leave");
        //     const leaveData = await leaveCollection.findOne({ _id: new ObjectId(req.body.leaveId) });

        //     req.body.requestedDate = leaveData?.startDate;
        //     req.body.refId = leaveData?.refId;
        //     const data = await collection.insertOne(req.body);

        //     res.status(200).json({ data: data });
        //   } catch (err) {
        //     if (err instanceof Error) {
        //       res.status(500).json({ error: err.message });
        //     } else {
        //       res.status(500).json({ error: 'An unknown error occurred' });
        //     }
        //   }
        //   break;

        case 'DELETE':
          try {
            const client = await clientPromise;
            const db = client.db("Spak");
            const collection = db.collection<AdminLeaveNotification>("adminLeaveNotification");
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
