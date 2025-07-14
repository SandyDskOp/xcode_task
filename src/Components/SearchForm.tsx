import React from "react";

const SearchForm = ({handleChange,searchData,fetchProducts}:any) => {
  return (
    <>
      <div>
        <select
          className="filter-input"
          name="type"
          onChange={handleChange}
          value={searchData.type}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <input
          className="filter-input"
          name="start_date"
          onChange={handleChange}
          value={searchData.start_date}
          type="date"
        />
      </div>
      <div>
        <input
          className="filter-input"
          name="end_date"
          onChange={handleChange}
          value={searchData.end_date}
          type="date"
        />
      </div>
      <div>
        <button className="filter-button" onClick={fetchProducts}>
          Search
        </button>
      </div>
    </>
  );
};

export default SearchForm;
