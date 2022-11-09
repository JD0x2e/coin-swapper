import React from "react";
import "../SelectButton/SelectButton.css";

export default function SelectButton({ children, selected, onClick }) {
  return (
    <div className="select-button-container">
      <span onClick={onClick} className="select-button">
        {children}
      </span>
    </div>
  );
}
