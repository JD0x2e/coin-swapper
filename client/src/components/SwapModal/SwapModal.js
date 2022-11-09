import React from "react";
import "../SwapModal/SwapModal.css";
import CSLogo from "../../images/blockchain2.png";

export default function SwapModal({ changeModal }) {
  return (
    <div className="modal">
      <div className="modal-box">
        {/* <img className="modal-img" src={CSLogo} alt={""} /> */}
        <p className="modal-text">Check Wallet...</p>

        <button className="modal-button" onClick={changeModal}>
          X
        </button>
      </div>
    </div>
  );
}
