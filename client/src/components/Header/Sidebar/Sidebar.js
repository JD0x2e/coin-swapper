import React from "react";
import { stack as Menu } from "react-burger-menu";
import "./Sidebar.css";
import CSLogo from "../../../images/CSLogo2.png";

export default function Sidebar() {
  return (
    <Menu className="Menu" width={"280px"} right>
      <img className="CSLogo" src={CSLogo} alt="CoinSwapper Logo" />
      <a className="menu-item" href="/">
        Home
      </a>

      <a className="menu-item" href="/favourites">
        Favourites
      </a>

      <a className="menu-item" href="/swap">
        Swap
      </a>
    </Menu>
  );
}
