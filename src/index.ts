import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import cors from "cors";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = path.join(__dirname, "asteroids.db");
const database = new DatabaseSync(dbPath);

database.exec(`
  CREATE TABLE IF NOT EXISTS favourites (
    asteroid_id TEXT PRIMARY KEY
  )
`);

const startServer = async () => {
  const app = express() as any;
  app.use(
    cors({
      origin: ["http://localhost:3000"],
    })
  );

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ database }),
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

startServer();
