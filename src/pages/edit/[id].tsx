import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormData } from '../../Interfaces/ProductInterface';
import toast from 'react-hot-toast';
import '../../styles/globals.css';
import useClient from '@/Hooks/useClient';
import {EDIT_PRODUCT, UPLOAD_IMAGE} from "@/Api_urls"

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const Client = useClient()

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await Client.get(EDIT_PRODUCT(id));
        reset(res.data);
        setPreview(res.data.imageUrl || '');
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
        toast.error(err.message || 'Failed to load product');
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      toast.error('Image must be less than 5MB');
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = preview;

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await Client.post(UPLOAD_IMAGE, formData);
        imageUrl = res.data.imageUrl;
      }

      await Client.put(EDIT_PRODUCT(id), { ...data, imageUrl });
      toast.success('Product updated successfully');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      toast.error(err.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1>Edit Product</h1>

      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Title</label>
        <input {...register('title')} placeholder="Title" />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea {...register('description')} placeholder="Description" />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="form-group">
        <label>Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview} alt="Preview" />}
      </div>

      <button type="submit" className="form-button" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update Product'}
      </button>
    </form>
  );
}
