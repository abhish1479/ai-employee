import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/api", routes);

app.get("/healthz", (_, res) => res.send("ok"));
app.listen(3001, () => console.log("gateway :3001"));
