import React from "react";
import { Link } from "react-router-dom";
import "../Header/Header.css";
import Sidebar from "./Sidebar/Sidebar";
import CSLogo from "../../images/CSLogo2.png";
import { ConnectKitButton } from "connectkit";

import styled from "styled-components";
const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 8px 16px;
  color: #ffffff;
  background: #333;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
`;

export default function Header() {
  return (
    <header className="header">
      <Sidebar />
      <div className="header-container">
        <div className="header-title">
          <Link to="/">
            <img className="cs-logo" src={CSLogo} alt="CoinSwapper Logo" />
          </Link>
        </div>
        <div>
          <ConnectKitButton.Custom className="connect-btn">
            {({ isConnected, show, truncatedAddress }) => {
              return <StyledButton onClick={show}>{isConnected ? truncatedAddress : "Connect Wallet"}</StyledButton>;
            }}
          </ConnectKitButton.Custom>
        </div>
      </div>
    </header>
  );
}
