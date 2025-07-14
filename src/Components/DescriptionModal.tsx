import React from "react";

const DescriptionModal = ({setSelectedDescription,selectedDescription}:any) => {
  return (
    <div className="modal-overlay" onClick={() => setSelectedDescription(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={() => setSelectedDescription(null)}
        >
          &times;
        </button>
        <h2>Full Description</h2>
        <p>{selectedDescription}</p>
      </div>
    </div>
  );
};

export default DescriptionModal;
