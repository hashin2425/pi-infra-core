const API_URL = "https://api.example.com/server-status";

// サーバー状態を更新する関数
function updateServerStatus(isOnline) {
  const statusElement = document.getElementById("serverStatus");
  statusElement.className = isOnline ? "status online" : "status offline";
  statusElement.textContent = isOnline ? "オンライン" : "オフライン";
}

// 温度を更新する関数
function updateTemperature(elementId, temperature) {
  document.getElementById(elementId).textContent = `${temperature.toFixed(1)}°C`;
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
      format: "HH:mm:ss",
    },
  },
  theme: {
    palette: "palette2",
  },
};

const chart = new ApexCharts(document.querySelector("#temperatureChart"), options);
chart.render();

// エラーメッセージを表示する関数
function showError(message) {
  const errorElement = document.getElementById("errorMessage");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// データを取得して更新する関数
async function fetchAndUpdateData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("ネットワークエラーが発生しました");
    }
    const data = await response.json();

    // データを更新
    updateServerStatus(data.isOnline);
    updateTemperature("roomTemperature", data.roomTemperature);
    updateTemperature("cpuTemperature", data.cpuTemperature);

    // グラフを更新
    const now = new Date().getTime();
    chart.appendData([
      {
        data: [{ x: now, y: data.roomTemperature }],
      },
      {
        data: [{ x: now, y: data.cpuTemperature }],
      },
    ]);

    // 最新の30データポイントのみを表示
    if (chart.w.globals.series[0].length > 30) {
      chart.updateOptions({
        series: [
          {
            data: chart.w.globals.series[0].slice(-30),
          },
          {
            data: chart.w.globals.series[1].slice(-30),
          },
        ],
      });
    }

    // エラーメッセージを非表示に
    document.getElementById("errorMessage").style.display = "none";
  } catch (error) {
    console.error("データの取得中にエラーが発生しました:", error);
    showError("データの取得中にエラーが発生しました。しばらくしてからもう一度お試しください。");
  }
}

// 初回データ取得
fetchAndUpdateData();

// 定期的にデータを更新（60秒ごと）
setInterval(fetchAndUpdateData, 60000);
