import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import { json } from 'express';
import profileRoutes from "./modules/profile/profile.routes";
import cookieParser from "cookie-parser";


export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true })); 
  app.use(json());
  app.use(cookieParser());

  app.use('/auth', authRoutes);
  console.log('Loaded profile routes:', profileRoutes);
  app.use('/profile', profileRoutes);




  app.get('/', (req, res) => res.json({ ok: true, msg: 'Hiready backend — Phase 1' }));

   app.get("/health", (req, res) => res.send("OK"));
  // 404
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  return app;
}
