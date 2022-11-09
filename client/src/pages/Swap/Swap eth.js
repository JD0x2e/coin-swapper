// import Moralis from "moralis";
import tokensJson from "../../config/tokens.json";
import "../Swap/Swap.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSendTransaction } from "wagmi";

export default function Swap() {
  const [fromToken] = useState("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const [toToken, setToToken] = useState("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
  const [value, setValue] = useState("10000000000000000");
  const [valueExchanged, setValueExchanged] = useState("");
  const [valueExchangedDecimals, setValueExchangedDecimals] = useState(1e18);
  const [to, setTo] = useState("");
  const [txData, setTxData] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    getBalance();
  }, []);

  const myAddress = "0x07cd4706735760050f2fC392db7D802e4e02FdF1";

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    request: {
      from: myAddress,
      to: String(to),
      data: String(txData),
      value: String(value),
    },
  });

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
      `https://api.1inch.io/v4.0/1/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${value}&fromAddress=${myAddress}&slippage=1`
    );
    console.log(tx.data);
    setTo(tx.data.tx.to);
    setTxData(tx.data.tx.data);
    setValueExchangedDecimals(Number(`1E${tx.data.toToken.decimals}`));
    setValueExchanged(tx.data.toTokenAmount);
  }

  async function getBalance() {
    const options = {
      method: "GET",
      url: "https://deep-index.moralis.io/api/v2/0x07cd4706735760050f2fC392db7D802e4e02FdF1/balance",
      params: { chain: "eth" },
      headers: {
        accept: "application/json",
        "X-API-Key": "9HZAj4EKLXtW7RMe7qtYpjexnFzNxImGTFT1LioD2bZOr0fTBVp50H7n4Hgn2klX",
      },
    };

    axios.request(options).then(function (res) {
      setBalance(res.data);
    });
  }

  return (
    <div>
      <div>Connected: {myAddress}</div>
      <br />
      <div>Ethereum Balance: {(balance.balance / 1e18).toFixed(4)}</div>
      <br />
      <select>
        <option value="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE">ETH</option>
      </select>
      <input
        onChange={(e) => changeValue(e)}
        value={value / 1e18}
        type="number"
        min={0}
        max={(balance.balance / 1e18).toFixed(4)}
      ></input>
      <br />
      <br />
      <select onChange={(e) => changeToToken(e)}>
        {tokensJson.map((token, idx) => (
          <option value={token.address} key={idx}>
            {token.symbol}
          </option>
        ))}
      </select>
      <input value={!valueExchanged ? "" : (valueExchanged / valueExchangedDecimals).toFixed(3)} disabled={true}></input>
      <br />
      <br />
      <button onClick={get1inchSwap}>Get Conversion</button>
      <button disabled={!valueExchanged} onClick={sendTransaction}>
        Swap Tokens
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      <br />
      <br />
    </div>
  );
}
