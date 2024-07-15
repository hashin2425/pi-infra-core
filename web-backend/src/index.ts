import express from "express";

const app = express();
const port = process.env.PORT || 3000; // App Serviceでは、自動的にポート番号が割り当てられる
const serverStartedUnixTime = Date.now();

app.get("/", (req, res) => {
  var serverRunningTime = Date.now() - serverStartedUnixTime;
  res.send(`${serverRunningTime}ms`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
