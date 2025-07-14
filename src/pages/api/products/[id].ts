import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import ProductModel from '../../../models/Product';
import { Product } from '../../../Interfaces/ProductInterface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product | { message: string }>
) {
  await dbConnect();
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        const product = await ProductModel.findById(id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);

      case 'PUT':
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(updatedProduct);

      case 'DELETE':
        const deletedProduct = await ProductModel.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
}