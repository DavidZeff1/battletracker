import express from "express";

const app = express();

app.get("/health", (req, res) => {
  res.send({ status: "up" });
});

app.listen(3002, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on 3002");
  }
});
