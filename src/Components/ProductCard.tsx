import React from "react";
import Link from "next/link";

const ProductCard = ({p,setSelectedDescription,handleDelete}:any) => {
  return (
    <div key={p._id} className="product-card">
      {p.imageUrl && <img src={p.imageUrl} width={100} alt={p.title} />}
      <h3>{p.title}</h3>
      <div className="truncated-description">{p.description}</div>
      <button
        onClick={() =>
          setSelectedDescription(p.description ? p.description : "")
        }
      >
        Show Full
      </button>
      <p>Status: {p.status}</p>
      <p>{new Date(p.date || "").toLocaleDateString()}</p>
      <div className="product-actions">
        <Link href={`/edit/${p._id}`}>Edit</Link>
        <button onClick={() => handleDelete(p._id!)}>Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;
