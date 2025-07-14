export interface Product {
  _id?: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  date?: string;
  imageUrl?: string;
}

export interface ProductFormData {
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  image?: File;
}