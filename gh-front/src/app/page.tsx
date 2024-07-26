"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const API_URL = "https://api.hashin.net/get_info";

// ApexChartsをクライアントサイドでのみ動作するように動的インポート
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartData {
  x: Date;
  y: number;
}

interface ApiData {
  timestamp: number[];
  room_temperature: number[];
  cpu_temperature: number[];
}

const Dashboard: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<string>("オフライン");
  const [roomTemperature, setRoomTemperature] = useState<number>(0);
  const [cpuTemperature, setCpuTemperature] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [roomChartData, setRoomChartData] = useState<ChartData[]>([]);
  const [cpuChartData, setCpuChartData] = useState<ChartData[]>([]);

  const updateServerStatus = (data: ApiData) => {
    const isOnline = data.timestamp[data.timestamp.length - 1] > Date.now() / 1000 - 300;
    setServerStatus(isOnline ? "オンライン" : "オフライン");
  };

  const updateLastUpdated = (timestamp: number) => {
    const lastUpdatedDate = new Date(timestamp * 1000).toLocaleString();
    const passedSeconds = Math.floor(Date.now() / 1000 - timestamp);
    setLastUpdated(`${lastUpdatedDate} (${passedSeconds}秒前)`);
  };

  const fetchAndUpdateData = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("ネットワークエラーが発生しました");
      }
      const data: ApiData = await response.json();

      updateServerStatus(data);
      if (data.room_temperature.length > 0 && data.cpu_temperature.length > 0 && data.timestamp.length > 0) {
        setRoomTemperature(data.room_temperature[data.room_temperature.length - 1]);
        setCpuTemperature(data.cpu_temperature[data.cpu_temperature.length - 1]);

        const newChartData = data.timestamp.map((time, index) => ({
          x: new Date(time * 1000),
          y: data.room_temperature[index],
        }));
        setRoomChartData(newChartData);

        const newCpuChartData = data.timestamp.map((time, index) => ({
          x: new Date(time * 1000),
          y: data.cpu_temperature[index],
        }));
        setCpuChartData(newCpuChartData);

        updateLastUpdated(data.timestamp[data.timestamp.length - 1]);
      }

      setErrorMessage("");
    } catch (error) {
      console.error("データの取得中にエラーが発生しました:", error);
      setErrorMessage("データの取得中にエラーが発生しました。しばらくしてからもう一度お試しください。");
    }
  };

  useEffect(() => {
    fetchAndUpdateData();
    const intervalId = setInterval(fetchAndUpdateData, 60000);
    const updateIntervalId = setInterval(() => updateLastUpdated(Date.now() / 1000), 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(updateIntervalId);
    };
  }, []);

  const chartOptions = {
    chart: {
      type: "area" as const,
      height: 300,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as const,
    },
    xaxis: {
      type: "datetime" as const,
      labels: {
        datetimeUTC: false,
        format: "MM/dd HH:mm",
      },
    },
    yaxis: {
      labels: {
        formatter: function (val: number) {
          return val.toFixed(1) + "°C";
        },
      },
    },
    legend: {
      position: "top" as const,
    },
    tooltip: {
      x: {
        format: "MM/dd HH:mm",
      },
    },
    theme: {
      palette: "palette2",
    },
  };

  return (
    <div>
      <h1>サーバー状態モニター</h1>

      <div id="serverStatus" className={`status ${serverStatus === "オンライン" ? "online" : "offline"}`}>
        {serverStatus}
        最終更新: <span id="lastUpdated">{lastUpdated}</span>
      </div>
      {errorMessage && (
        <div id="errorMessage" style={{ display: "block", color: "red" }}>
          {errorMessage}
        </div>
      )}

      <div id="roomTemperatureChart">
        <h2>
          室温: <span id="roomTemperature">{roomTemperature.toFixed(1)}°C</span>
        </h2>
        <ApexCharts options={chartOptions} series={[{ name: "室温", data: roomChartData }]} type="area" height={300} />
      </div>
      <div id="cpuTemperatureChart">
        <h2>
          CPU温度: <span id="cpuTemperature">{cpuTemperature.toFixed(1)}°C</span>
        </h2>
        <ApexCharts options={chartOptions} series={[{ name: "CPU温度", data: cpuChartData }]} type="area" height={300} />
      </div>
    </div>
  );
};

export default Dashboard;
