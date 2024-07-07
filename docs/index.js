const API_URL = "https://api.hashin.net/get_info";

// サーバー状態を更新する関数
function updateServerStatus(data) {
  const statusElement = document.getElementById("serverStatus");
  const isOnline = data.timestamp[data.timestamp.length - 1] > Date.now() / 1000 - 300;
  statusElement.className = isOnline ? "status online" : "status offline";
  statusElement.textContent = isOnline ? "オンライン" : "オフライン";
}

// 温度を更新する関数
function updateTemperature(elementId, temperature) {
  document.getElementById(elementId).textContent = `${temperature.toFixed(1)}°C`;
}

// タイムスタンプを生成する関数
function generateTimestamps(dataLength) {
  const now = new Date();
  const timestamps = [];
  for (let i = 0; i < dataLength; i++) {
    timestamps.unshift(new Date(now - i * 60000)); // 1分ごとのデータと仮定
  }
  return timestamps;
}

// エラーメッセージを表示する関数
function showError(message) {
  const errorElement = document.getElementById("errorMessage");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// グラフオプション
const options = {
  series: [
    {
      name: "室温",
      data: [],
    },
    {
      name: "CPU温度",
      data: [],
    },
  ],
  chart: {
    type: "area",
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
    curve: "smooth",
  },
  xaxis: {
    type: "datetime",
    labels: {
      datetimeUTC: false,
      format: "MM/dd HH:mm",
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(1) + "°C";
      },
    },
  },
  legend: {
    position: "top",
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

const roomTemperatureChart = new ApexCharts(document.querySelector("#roomTemperatureChart"), options);
roomTemperatureChart.render();

const cpuTemperatureChart = new ApexCharts(document.querySelector("#cpuTemperatureChart"), options);
cpuTemperatureChart.render();

let lastData = {};

// データを取得して更新する関数
async function fetchAndUpdateData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("ネットワークエラーが発生しました");
    }
    const data = await response.json();
    lastData = data;

    // データを更新
    updateServerStatus(data);
    if (data.room_temperature.length > 0 && data.cpu_temperature.length > 0 && data.timestamp.length > 0) {
      updateTemperature("roomTemperature", data.room_temperature[data.room_temperature.length - 1]);
      updateTemperature("cpuTemperature", data.cpu_temperature[data.cpu_temperature.length - 1]);

      // グラフを更新
      const newData = data.timestamp.map((time, index) => ({
        x: new Date(time * 1000),
        y1: data.room_temperature[index],
        y2: data.cpu_temperature[index],
      }));

      roomTemperatureChart.updateSeries([
        {
          name: "室温",
          data: newData.map((item) => ({ x: item.x, y: item.y1 })),
        },
      ]);
      cpuTemperatureChart.updateSeries([
        {
          name: "CPU温度",
          data: newData.map((item) => ({ x: item.x, y: item.y2 })),
        },
      ]);
    }

    // エラーメッセージを非表示に
    document.getElementById("errorMessage").style.display = "none";
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error);
    showError("データの取得中にエラーが発生しました。しばらくしてからもう一度お試しください。");
  }
}

function updateLastUpdated() {
  // 最終更新日時を表示
  const lastUpdatedDate = new Date(lastData.timestamp[lastData.timestamp.length - 1] * 1000).toLocaleString();
  const passedMinutes = Math.floor(Date.now() / 1000 - lastData.timestamp[lastData.timestamp.length - 1]);
  document.getElementById("lastUpdated").textContent = lastUpdatedDate + " (" + passedMinutes + "秒前)";
}

// 初回データ取得
fetchAndUpdateData();

// 定期的にデータを更新（60秒ごと）
setInterval(fetchAndUpdateData, 60000);

// 最終更新日時を表示（1秒ごと）
setInterval(updateLastUpdated, 1000);
