import express, { Express, Request, Response } from "express";
import { db } from "./database/connectdb";
import { config } from "./lib/config/app.config";
// import dotenv from "dotenv"

// dotenv.config()

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express with TypeScript Server");
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port} in ${process.env.NODE_ENV}`);
  await db.execute('select 1')
  .then(() => console.log("Database successfully connected"))
  .catch(() => console.log("database could not successfully connect"))
});
