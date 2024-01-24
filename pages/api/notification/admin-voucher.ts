import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../libs/mongodb';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../libs/verifyToken';
import runMiddleware from '@/libs/runMiddleware';
import Cors from 'cors';

type Voucher = { _id: ObjectId, type: string, voucherNo: number, personId: string, approvalStatus: string, voucherDate: Date, voucherAmount: number, voucherData: any[], refId: string, isApproved: string };

type User = { _id: ObjectId, firstName: string, lastName: string, username: string, password: string, imgUrl: string, date: Date, designation: '', doj: string, uploadDocument: string };

type AdminVoucherNotification = { id: ObjectId; voucherId: string; status: string; actionDate: Date, requestedDate: Date, refId: string, };

type ApiResponse = | { message: string } | AdminVoucherNotification | AdminVoucherNotification[] | { data: any } | { error: string };


enum ApprovalStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

const cors = Cors({
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

            const collection = db.collection<AdminVoucherNotification>("adminVoucherNotification");
            const data = await collection.find({}).sort({ createdDate: -1 }).limit(4).toArray();

            const voucherCollection = db.collection<Voucher>("voucher");
            const voucherData = await voucherCollection.find({}).toArray();

            const userCollection = db.collection<User>("user");
            const userData = await userCollection.find({}).toArray();

            const voucherOutput: any[] = [];

            data.forEach((item, indx) => {
              const result = voucherData.find((vItem) => vItem._id.toString() === item.voucherId.toString());
              if (result) {
                voucherOutput.push({ ...result, notificationId: item._id });
              }
            });

            const finalOutput: any[] = [];

            voucherOutput.forEach((item, indx) => {
              const user = userData.find((uItem) => uItem._id.toString() === item.refId.toString());
              if (user) {
                finalOutput.push({ user: user, voucher: item });
              }
            });

            console.log(finalOutput);

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

        // case 'VOUCHERCREATE':
        //   try {
        //     const client = await clientPromise;
        //     const db = client.db("Spak");
        //     const collection = db.collection<VoucherNotification>("vouchernotification");
        //     delete req.body.type;

        //     const voucherCollection = db.collection<Voucher>("voucher");
        //     const voucherData = await voucherCollection.findOne({ _id: new ObjectId(req.body.voucherId) });

        //     req.body.requestedDate = voucherData?.voucherDate;
        //     req.body.refId = voucherData?.refId;
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

        // case 'DELETE':
        //   try {
        //     const client = await clientPromise;
        //     const db = client.db("Spak");
        //     const collection = db.collection<VoucherNotification>("vouchernotification");
        //     const result = await collection.deleteOne({ _id: new ObjectId(req.body.id) });
        //     res.status(200).json({ data: result });
        //   } catch (err) {
        //     if (err instanceof Error) {
        //       res.status(500).json({ error: err.message });
        //     } else {
        //       res.status(500).json({ error: 'An unknown error occurred' });
        //     }
        //   }
        //   break;

        default:
          res.status(500).json({ data: '' });
      }
    }

    res.status(500).json({ data: 'Not Data Found' });

  }
}
