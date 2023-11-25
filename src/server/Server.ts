import express from "express";
import cors from 'cors';
import 'dotenv/config';
import './shared/services/TranslationsUp';
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../swagger.json";

import { router } from './routes'

const server = express();

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

server.use(cors({
  origin: process.env.ENABLED_CORS?.split(';') || []
}));



server.use(express.json());

server.use(router);

export { server };