import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CoinList, SingleCoin } from "../../config/api";
import { numberWithCommas } from "../../components/CoinsTable/CoinsTable";
import Parse from "html-react-parser";
import axios from "axios";
import "../CoinPage/CoinPage.css";
import CoinInfo from "../../components/CoinInfo/CoinInfo";
import { LinearProgress } from "@material-ui/core";

export default function CoinPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState({});
  const [priceChange, setPriceChange] = useState("");
  const [mcChange, setMcChange] = useState("");

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  const fetchPriceChange = async () => {
    const res = await axios.get(CoinList());
    const newPrice = res.data.filter((obj) => {
      return obj.id === id;
    });
    setPriceChange(newPrice[0].price_change_percentage_24h.toFixed(2));
  };

  const fetchMcChange = async () => {
    const res = await axios.get(CoinList());
    const newMc = res.data.filter((obj) => {
      return obj.id === id;
    });
    setMcChange(newMc[0].market_cap_change_percentage_24h.toFixed(2));
  };

  useEffect(() => {
    fetchCoin();
    fetchPriceChange();
    fetchMcChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!coin) return <LinearProgress style={{ backgroundColor: "#2fe628" }} />;

  return (
    <>
      <div className="info-container">
        <div className="sidebar-container">
          <span>
            <p className="marketdata-rank">Rank #{numberWithCommas(coin?.market_cap_rank)}</p>
          </span>
          <img className="sidebar-img" src={coin?.image?.large} alt={coin?.name} />
          <div className="sidebar-heading">
            <p className="sidebar-title">{coin?.name}</p>
            <p className="sidebar-symbol">({coin?.symbol})</p>
          </div>
          <div className="sidebar-description">{Parse(coin.description ? coin?.description?.en.split(". ")[0] : "")}</div>
          <div className="sidebar-lower-container">
            <div className="sidebar-price-container">
              <div className="marketdata-price">
                <p className="current-price">Current Price: &nbsp;</p>
                <p>
                  {"$"}
                  {numberWithCommas(coin?.market_data?.current_price.usd)}
                </p>
              </div>
              <p className={`${parseFloat(priceChange) > 0 ? "price-change-pos" : "price-change-neg"}`}>
                {parseFloat(priceChange) > 0 && "+"}
                {priceChange}%
              </p>
            </div>
            <div className="sidebar-mc-container">
              <div className="marketdata-mc">
                <p className="current-mc">Market Cap: &nbsp;</p>
                <p>
                  {"$"}
                  {numberWithCommas(coin?.market_data?.market_cap.usd)}
                </p>
              </div>
              <p className={`${parseFloat(mcChange) > 0 ? "price-change-pos" : "price-change-neg"}`}>
                {parseFloat(mcChange) > 0 && "+"}
                {mcChange}%
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <div className="chart-container">
        <CoinInfo coin={coin} />
      </div>
    </>
  );
}
