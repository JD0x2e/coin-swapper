import axios from "axios";
import React, { useEffect, useState } from "react";
import { HistoricalChart } from "../../config/api";
import SelectButton from "../SelectButton/SelectButton";
import { chartDays } from "../../config/data";
import "../CoinInfo/CoinInfo.css";
import { CircularProgress } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import { useParams } from "react-router-dom";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);
ChartJS.defaults.font.size = 9;

export default function CoinInfo({ coin, selected }) {
  const { id } = useParams();
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);
  const [flag, setFlag] = useState(false);

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(id, days));
    setFlag(true);
    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div className="chart-container">
      <div className="chart">
        {!historicalData | (flag === false) ? (
          <CircularProgress style={{ color: "#2fe628" }} size={100} thickness={1} />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in usd`,
                    borderColor: "#00ef8f",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
          </>
        )}
      </div>
      <div className="button-container">
        {chartDays.map((days) => (
          <SelectButton
            key={days.value}
            onClick={() => {
              setDays(days.value);
              setFlag(false);
            }}
            selected={days.value === days}
          >
            {days.label}
          </SelectButton>
        ))}
      </div>
    </div>
  );
}
