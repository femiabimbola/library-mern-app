import express, { Express, Request, Response } from "express";
import { db } from "./database/connectdb";
import router from "./routes";
import session from "express-session";
import passport from "passport"
// import { config } from "./lib/config/app.config";
import { sessionObject } from "./lib/sessionObject";


const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express with TypeScript Server");
});

app.use(passport.initialize())
app.use(passport.session())
app.use(session(sessionObject))
app.use("/api/", router)
// app.use(router)


app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port} in ${process.env.NODE_ENV}`);
  await db.execute('select 1')
  .then(() => console.log("Database successfully connected"))
  .catch(() => console.log("database could not successfully connect"))
});
