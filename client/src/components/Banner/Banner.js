import React from "react";
import "../Banner/Banner.css";
import Carousel from "./Carousel/Carousel";

export default function Banner() {
  return (
    <>
      <div className="banner-container">
        <div className="banner-content">
          <h1 className="banner-title">CoinSwapper</h1>
          <p className="banner-info">One-stop shop for all your Crypto needs</p>
        </div>
        <div className="carousel-container">
          <Carousel />
        </div>
      </div>
    </>
  );
}
