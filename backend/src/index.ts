import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
}
)