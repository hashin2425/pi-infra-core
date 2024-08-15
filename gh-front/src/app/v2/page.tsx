"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const API_URL = "https://api-a.hashin.net/get-status/";

const chartOptions = {
  chart: {
    type: "area" as const,
    height: 300,
    animations: {
      enabled: true,
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

interface ChartDataProps {
  x: Date;
  y: number;
}

interface MachineStatusProps {
  name: string;
  display_name: string;
  value: number;
  x?: number[];
  y?: number[];
}

interface ApiData {
  server_time: number;
  machine_time: number;
  endpoint_name: string;
  machine_status: [MachineStatusProps?];
  running_jobs: object;
}

let receivedApiData: ApiData = {
  server_time: 0,
  machine_time: 0,
  endpoint_name: "Missing",
  machine_status: [],
  running_jobs: [],
};

function getElapsedTimeString(startTime: Date): string {
  const now: Date = new Date();
  const elapsedMilliseconds = now.getTime() - startTime.getTime();
  const seconds = Math.floor(elapsedMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}時間${minutes % 60}分${seconds % 60}秒`;
  } else if (minutes > 0) {
    return `${minutes}分${seconds % 60}秒`;
  } else {
    return `${seconds}秒`;
  }
}

function MachineStatusDisplay({ status }: { status: MachineStatusProps }) {
  const isHaveChartData = Array.isArray(status.x) && Array.isArray(status.y) && status.x.length === status.y.length;
  let chartData: ChartDataProps[];
  if (isHaveChartData) {
    chartData = status.x.map((x: number, index: number) => ({ x: new Date(status.x[index] * 1000), y: status.y[index] }));
  }
  return (
    <div className="p-2">
      <div className="bg-white shadow-xl rounded-xl p-4">
        <h3 className="text-lg">{status.display_name}</h3>
        <p className="text-xl text-blue-500 font-bold">{status.value}</p>
        {isHaveChartData && <ApexCharts options={chartOptions} series={[{ name: "", data: chartData }]} type="area" height={350} />}
      </div>
    </div>
  );
}

const Main: React.FC = () => {
  //const [apiData, setApiData] = useState<ApiData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [serverTime, setServerTime] = useState<string>("");
  const [machineTime, setMachineTime] = useState<string>("");
  const [endpointName, setEndpointName] = useState<string>("");
  const [machineStatus, setMachineStatus] = useState<[MachineStatusProps?]>([]);
  const [runningJobs, setRunningJobs] = useState<object[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // 1 min
  useEffect(() => {
    const fetchAndUpdateData = async () => {
      try {
        if (lastFetchTime + 60000 > new Date().getTime()) return;

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("ネットワークエラーが発生しました");

        setLastFetchTime(new Date().getTime());
        receivedApiData = await response.json();
        console.log(receivedApiData);

        setEndpointName(receivedApiData.endpoint_name);
        setMachineStatus(receivedApiData.machine_status);
        setRunningJobs(Object.entries(receivedApiData.running_jobs));
      } catch (error) {
        console.error("データの取得中にエラーが発生しました:", error);
        console.log(receivedApiData.machine_status);
        console.log(receivedApiData);
      }
    };
    fetchAndUpdateData();
    const intervalId = setInterval(fetchAndUpdateData, 60000);
  }, []);

  // 1 sec
  useEffect(() => {
    const updateIntervalId = setInterval(() => {
      var temp_updated = new Date(receivedApiData.server_time * 1000);
      var temp_machine_time = new Date(receivedApiData.machine_time * 1000);
      setServerTime(`${temp_updated.toLocaleString()}（${getElapsedTimeString(temp_updated)}前）`);
      setMachineTime(`${temp_machine_time.toLocaleString()}（${getElapsedTimeString(temp_machine_time)}前）`);
    }, 1000);
    return () => clearInterval(updateIntervalId);
  }, []);

  return (
    <main className="p-4 mw-400">
      <table className="gray-table">
        <tbody>
          <tr>
            <th>サーバー</th>
            <td>{endpointName}</td>
          </tr>
          <tr>
            <th>サーバー時刻</th>
            <td>{serverTime}</td>
          </tr>
          <tr>
            <th>マシン時刻</th>
            <td>{machineTime}</td>
          </tr>
        </tbody>
      </table>
      {machineStatus.map((status, index) => {
        if (status) {
          return <MachineStatusDisplay status={status} key={index} />;
        }
      })}
    </main>
  );
};
export default Main;
