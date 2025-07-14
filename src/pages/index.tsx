import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hooks/useAppDispatch";
import { useAppSelector } from "../store/hooks/useAppSelector";
import {
  setProducts,
  setLoading,
  setError,
} from "../store/Slices/ProductSlice";
import { Product } from "../Interfaces/ProductInterface";
import "../styles/globals.css";
import useClient from "@/Hooks/useClient";
import { DELETE_URL, GET_PRODUCTS } from "@/Api_urls";
import SearchForm from "@/Components/SearchForm";
import ProductCard from "@/Components/ProductCard";
import DescriptionModal from "@/Components/DescriptionModal";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const Client = useClient();
  const { items, loading, error } = useAppSelector((state) => state.products);
  const [searchData, setSearchData] = useState({
    type: "",
    start_date: "",
    end_date: "",
  });
  const [selectedDescription, setSelectedDescription] = useState<string | null>(
    null
  );

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      let query_string = `type=${searchData.type}&start_date=${
        searchData.start_date ? searchData.start_date : ""
      }&end_date=${searchData.end_date ? searchData.end_date : ""}`;
      const res = await Client.get(GET_PRODUCTS(query_string));
      dispatch(setProducts(res.data));
    } catch (err: any) {
      dispatch(setError(err.message));
      toast.error(err.message || "Failed to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await Client.delete(DELETE_URL(id));
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete product");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Product Dashboard</h1>
        <Link href="/add">Add Product</Link>
      </div>

      <div className="filter-container">
        <SearchForm
          handleChange={handleChange}
          searchData={searchData}
          fetchProducts={fetchProducts}
        />
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          {items.length > 0 ? (
            <div className="product-grid">
              {items.map((p: Product) => (
                <ProductCard
                  key={p._id}
                  p={p}
                  setSelectedDescription={setSelectedDescription}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div>No Products Found</div>
          )}
        </>
      )}

      {selectedDescription && (
        <DescriptionModal
          setSelectedDescription={setSelectedDescription}
          selectedDescription={selectedDescription}
        />
      )}
    </div>
  );
}
