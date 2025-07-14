import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import ProductModel from '../../../models/Product';
import { Product } from '../../../Interfaces/ProductInterface';

interface QueryParams {
  type?: string;
  start_date?: string;
  end_date?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | Product[] | { message: string }>
) {
  await dbConnect();

  try {
    switch (req.method) {
      case 'GET': {
        const { type, start_date, end_date } = req.query as QueryParams;
        const query: Record<string, any> = {};

        if (type && type !== "") {
          query.status = type;
        }

        if (start_date && end_date && start_date !== "" && end_date !== "") {
          const start_time = new Date(start_date).setHours(0, 0, 0, 0);
          const end_time = new Date(end_date).setHours(23, 59, 59, 999);
          
          query.$and = [
            { date: { $gte: start_time } },
            { date: { $lte: end_time } }
          ];
        }

        const products = await ProductModel.find(query).sort({ date: -1 });
        return res.status(200).json(products);
      }

      case 'POST': {
        const product = await ProductModel.create(req.body);
        return res.status(201).json(product);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server Error' });
  }
}