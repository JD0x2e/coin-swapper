import "../Swap/Swap.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import tokensJsonArb from "../../config/tokensArb.json";
import ETHLogo from "../../images/tokenimg/eth.png";
import "../../components/SwapModal/SwapModal.css";
import Cog from "../../images/cog-wheel.png";
import { Spinner } from "loading-animations-react";
import ARBLogo from "../../images/logo-Arbiscan.svg";

export default function Swap() {
  const [fromToken] = useState("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const [toToken, setToToken] = useState("");
  const [value, setValue] = useState("10000000000000000");
  const [valueExchanged, setValueExchanged] = useState("");
  const [valueExchangedDecimals, setValueExchangedDecimals] = useState(1e18);
  const [to, setTo] = useState("");
  const [txData, setTxData] = useState("");
  const [balance, setBalance] = useState("");
  const [listShow, setListShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const changeModal = () => {
    setModalShow(!modalShow);
  };

  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
  });

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const balance = await provider.getBalance(account.address, "latest");
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

  const handleListShow = () => {
    setListShow(!listShow);
  };

  const handleToToken = (token) => {
    setToToken(token);
  };

  return (
    <div className="swap">
      <div className="balance">
        <img className="balance-logo" src={ETHLogo} alt="" width="20" height="20" />
        <p>Balance: {(balance / 1e18).toFixed(3)}</p>
      </div>
      <div className="swap-container">
        <div className="swap-content-top">
          <p className="swap-title">Swap</p>
          <img className="swap-cog" src={Cog} alt="Cog wheel" width={20} height={20} />
        </div>
        <div className="swap-content">
          <div className="input-box">
            <input
              onChange={(e) => changeValue(e)}
              value={value / 1e18}
              type="number"
              min={0}
              max={(balance.balance / 1e18).toFixed(3)}
              placeholder={"0.0"}
            ></input>
            <button className="input-btn">
              <div className="input-inner-box">
                <img className="input-logo" src={ETHLogo} alt="Ethereum Logo" />
                <option className="input-symbol" onChange={(e) => changeToToken(e)} value={fromToken}>
                  <p>ETH</p>
                </option>
              </div>
            </button>
          </div>

          <div className="output-box">
            <input
              onChange={(e) => changeValue(e)}
              value={!valueExchanged ? "" : (valueExchanged / valueExchangedDecimals).toFixed(3)}
              // disabled={true}
              placeholder={"0.0"}
            ></input>
            <button className="output-btn" onClick={handleListShow}>
              <div className="output-inner-box">
                {toToken === "" && "Select Token"}
                {toToken !== "" && (
                  <img
                    src={tokensJsonArb.find((token) => token.address === toToken).logoURI}
                    alt=""
                    className="output-logo"
                  />
                )}
                {toToken !== "" && tokensJsonArb.find((token) => token.address === toToken).symbol}
              </div>
            </button>
            <div className="dropdown-content">
              {listShow &&
                tokensJsonArb.map((token, idx) => {
                  return (
                    <button className="dropdown-list" key={idx} onClick={() => handleToToken(token.address)}>
                      <img src={token.logoURI} alt="" />
                      {token.symbol}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="button-containers">
            <button className="conversion-btn" onClick={get1inchSwap}>
              Get Conversion
            </button>
            <button className="swap-btn" disabled={false} onClick={sendTransaction}>
              Swap Tokens
            </button>
          </div>
        </div>
      </div>
      {
        (modalShow,
        isLoading && (
          <div className="modal">
            <div className="modal-box">
              <p className="walletcheck-msg">Checking Wallet...</p>
              <Spinner className="spinner-loading" color1="#00aeef" color2="#2fe628" textColor="rgba(0,0,0, 0.5)" />
              <button className="modal-button" onClick={changeModal}>
                X
              </button>
            </div>
          </div>
        ))
      }
      {isSuccess && (
        <div className="transaction-container">
          <h4 className="transaction-title">Click to see your txn status</h4>
          <a className="transaction-msg" href={`https://arbiscan.io/tx/${data?.hash}`} target="_blank" rel="noreferrer">
            <img src={ARBLogo} alt="" width={200} height={30} />
          </a>
        </div>
      )}
    </div>
  );
}
