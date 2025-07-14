import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active', 'inactive'], required: true },
  date: { type: Date, default: Date.now },
  imageUrl: String,
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);