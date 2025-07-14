import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { ProductFormData } from "../Interfaces/ProductInterface";
import toast from 'react-hot-toast';
import "../styles/globals.css";
import useClient from "../Hooks/useClient"
import {ADD_PRODUCT, UPLOAD_IMAGE} from "../Api_urls"

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

export default function AddProduct() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Client = useClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({ resolver: zodResolver(schema) });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      toast.error("Please upload an image file")
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      toast.error("Image must be less than 5MB")
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
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const res = await Client.post(UPLOAD_IMAGE, formData);
        imageUrl = res.data.imageUrl;
      }

      await Client.post(ADD_PRODUCT, { ...data, imageUrl });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to add product");
      toast.error(err.message || "Failed to add product")
    } finally {
      setIsSubmitting(false);
      toast.success("Product added successfully")
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h1>Add Product</h1>

      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Title</label>
        <input {...register("title")} placeholder="Title" />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea {...register("description")} placeholder="Description" />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select {...register("status")}>
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
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
