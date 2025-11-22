import express from "express";

const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
  res.send({ health: "up" });
});

app.post("/api/locations", (req, res) => {
  const location = req.body.location;
  console.log(location.lat, location.lng);
  res.send(req.body);
});

app.listen(3001, () => {
  console.log(`listening on 3001`);
});
