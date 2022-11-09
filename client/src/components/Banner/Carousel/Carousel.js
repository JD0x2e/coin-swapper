import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../../config/api";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "../Carousel/Carousel.css";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const [trending, setTrending] = useState([]);

  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins());
    setTrending(data);
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, []);

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    const profitStyles = {
      color: profit > 0 ? "rgb(14, 203, 129)" : "red",
    };

    return (
      <Link className="carousel-item" to={`/coins/${coin.id}`}>
        <img className="coin-img" src={coin?.image} alt={coin.name} height="60" />
        <span className="coin-name">{coin?.symbol}&nbsp;</span>
        <span className="coin-percentage-change" style={profitStyles}>
          {profit && "+"}
          {coin?.price_change_percentage_24h?.toFixed(2)}%
        </span>
        <span className="coin-price">${numberWithCommas(coin?.current_price.toFixed(2))}</span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 1,
    },
    512: {
      items: 3,
    },
  };

  return (
    <div>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={600}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
