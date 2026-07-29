import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import routes from "./routes/index.js";
import notFound from "./middleware/notFound.middleware.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

/* ----------------------- Security Middleware ----------------------- */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://kinetic-care-kc.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      // Check if origin matches allowedOrigins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(helmet());

/* ----------------------- Body Parsers ----------------------- */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

/* ----------------------- Logger ----------------------- */

app.use(morgan("dev"));

/* ----------------------- API Routes ----------------------- */

app.use("/api/v1", routes);

/* ----------------------- Not Found ----------------------- */

app.use(notFound);

/* ----------------------- Global Error Handler ----------------------- */

app.use(errorHandler);

export default app;
