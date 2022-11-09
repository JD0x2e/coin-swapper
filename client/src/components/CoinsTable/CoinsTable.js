import React, { useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "../../config/api";
import { useNavigate } from "react-router-dom";
import "../CoinsTable/CoinsTable.css";
import { Pagination } from "@mui/material";
import Star from "../../images/whitestar.png";

import {
  Container,
  TableCell,
  LinearProgress,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@material-ui/core";

export function numberWithCommas(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBar, setSearchBar] = useState("");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList());
    setCoins(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSearchBar(e.target.value);
  };

  const handleSearch = () => {
    return coins.filter(
      (coin) => coin.name.toLowerCase().includes(searchBar) || coin.symbol.toLowerCase().includes(searchBar)
    );
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return (
    <div>
      <div className="bottom-container">
        <h3 className="bottom-title">Cryptocurrency Prices by Market Cap</h3>
      </div>
      <div className="search-bar-container">
        <input className="search-bar" type="text" placeholder="Search here" onChange={handleChange} value={searchBar} />
        <button className="search-btn">&#128270;</button>
      </div>

      <Container style={{ textAlign: "center" }}>
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#2fe628" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ background: "var(--main)" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap", "Favourites"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow onClick={() => navigate(`/coins/${row?.id}`)} className="row" key={row.name}>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                            color: "white",
                          }}
                        >
                          <img src={row?.image} alt={row.name} height="25" width="25" />
                          <div style={{ display: "flex", flexDirection: "column" }}></div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 13,
                                textTransform: "Capitalize",
                                color: "white",
                                marginBottom: "2.5px",
                              }}
                            >
                              {row.name}
                            </span>
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 10,
                                color: "darkgrey",
                              }}
                            >
                              {row.symbol}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right" style={{ color: "white", fontSize: "12.5px" }}>
                          ${numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                            fontSize: "12.5px",
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right" style={{ color: "white", fontSize: "12.5px" }}>
                          ${numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                        </TableCell>
                        <TableCell align="center" style={{ color: "white" }}>
                          <img src={Star} alt="Star" className="star-logo" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          className="Pagination"
          // count={(handleSearch()?.length / 10).toFixed(0)}
          count={25}
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 5,
            paddingRight: 5,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            color: "#fff",
          }}
          classes={Pagination}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </div>
  );
};

export default CoinsTable;
