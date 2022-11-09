import "../Swap/Swap.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import tokensJsonArb from "../../config/tokensArb.json";
import ETHLogo from "../../images/tokenimg/eth.png";
import SwapModal from "../../components/SwapModal/SwapModal";
import "../../components/SwapModal/SwapModal.css";
import CSLogo from "../../images/blockchain2.png";

export default function Swap() {
  const [fromToken] = useState("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const [toToken, setToToken] = useState("0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"); // WETH ARBI
  const [value, setValue] = useState("10000000000000000");
  const [valueExchanged, setValueExchanged] = useState("");
  const [valueExchangedDecimals, setValueExchangedDecimals] = useState(1e18);
  const [to, setTo] = useState("");
  const [txData, setTxData] = useState("");
  const [balance, setBalance] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // const changeModal = () => {
  //   setModalShow(!modalShow);
  // };

  console.log(modalShow);
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
  });

  useEffect(() => {
    getBalance();
  }, []);

  const myAddress = account.address;

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    request: {
      from: myAddress,
      to: String(to),
      data: String(txData),
      value: String(value),
    },
  });

  async function getBalance() {
    const ethers = require("ethers");
    (async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://maximum-palpable-gas.arbitrum-mainnet.discover.quiknode.pro/1cbe8b0f58e7c2075bbaab1be8cec079519a846f/"
      );
      const balance = await provider.getBalance("0x2eAA7327e9B5Ff46bc2B7452acE9e44A1528eb84", "latest");
      setBalance(balance.toString());
    })();
  }

  function changeToToken(e) {
    setToToken(e.target.value);
    setValueExchanged("");
  }

  function changeValue(e) {
    setValue(e.target.value * 1e18);
    setValueExchanged("");
  }

  async function get1inchSwap() {
    const tx = await axios.get(
      `https://api.1inch.io/v4.0/42161/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${value}&fromAddress=${myAddress}&slippage=1`
    );
    console.log(tx.data);
    setTo(tx.data.tx.to);
    setTxData(tx.data.tx.data);
    setValueExchangedDecimals(Number(`1E${tx.data.toToken.decimals}`));
    setValueExchanged(tx.data.toTokenAmount);
  }

  return (
    <div className="swap">
      <div className="balance">
        <img className="balance-logo" src={ETHLogo} alt="" width="20" height="20" />
        <p>Balance: {(balance / 1e18).toFixed(4)}</p>
      </div>
      <div className="swap-container">
        <input
          onChange={(e) => changeValue(e)}
          value={value / 1e18}
          type="number"
          min={0}
          max={(balance.balance / 1e18).toFixed(3)}
          placeholder={"0.0"}
        ></input>
        <select onChange={(e) => changeToToken(e)}>
          <option value="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE">ETH</option>
        </select>

        <input
          value={!valueExchanged ? "" : (valueExchanged / valueExchangedDecimals).toFixed(3)}
          disabled={true}
          placeholder={"0.0"}
        ></input>
        <select onChange={(e) => changeToToken(e)}>
          {tokensJsonArb.map((token, idx) => (
            <option value={token.address} key={idx}>
              {token.symbol}
            </option>
          ))}
        </select>
        <div className="button-containers">
          <button className="coversion-btn" onClick={get1inchSwap}>
            Get Conversion
          </button>
          <button className="swap-btn" disabled={false} onClick={sendTransaction}>
            Swap Tokens
          </button>
        </div>
      </div>
      <div>
        {isLoading && (
          <div className="modal">
            {SwapModal}
            <div className="modal-box">
              <p className="modal-text">Checking Wallet...</p>

              <button className="modal-button" onClick={""}>
                X
              </button>
            </div>
          </div>
        )}
      </div>

      {isSuccess && <div className="transaction-msg">Transaction: {JSON.stringify(data)}</div>}
      <br />
      <br />
    </div>
  );
}
