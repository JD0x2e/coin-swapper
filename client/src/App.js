import "./App.css";
import Header from "./components/Header/Header";
import CoinPage from "./pages/CoinPage/CoinPage";
import Home from "./pages/Home/Home";
import Swap from "./pages/Swap/Swap";
import Favourites from "./pages/Favourites/Favourites";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createClient, WagmiConfig, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const alchemyId = process.env.ALCHEMY_ID;

const client = createClient(
  getDefaultClient({
    appName: "Coinswapper",
    alchemyId,
    chains: [chain.arbitrum],
  })
);
export default function App() {
  return (
    <BrowserRouter>
      <WagmiConfig client={client}>
        <ConnectKitProvider
          theme="auto"
          mode="dark"
          customTheme={{
            Poppins: "sans-serif",
            fontSize: "5px",
            "--ck-connectbutton-font-size": 10,
          }}
        >
          <div className="App">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/coins/:id" element={<CoinPage />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/swap" element={<Swap />} />
            </Routes>
          </div>
        </ConnectKitProvider>
      </WagmiConfig>
    </BrowserRouter>
  );
}
