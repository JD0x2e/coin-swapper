import React from "react";
import "../SwapModal/SwapModal.css";

export default function SwapModal({ changeModal }) {
  return (
    <div className="modal">
      <div className="modal-box">
        <p className="modal-text">Check Wallet...</p>

        <button className="modal-button" onClick={changeModal}>
          X
        </button>
      </div>
    </div>
  );
}
