import express from "express";

const app = express();
const port = process.env.PORT || 3000; // App Serviceでは、自動的にポート番号が割り当てられる

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
