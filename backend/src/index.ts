// import { clientCache } from "@middlewares/cache.js"; // Disabled for now or use in-memory
import { clientCache } from "@middlewares/cache.js";
import appConfig from "@configs/app.config.js";
import express from "express";
import errorHandler from "@middlewares/errorHandler.js";
import otakudesuRouter from "@routes/otakudesu.routes.js";
import samehadakuRouter from "@routes/samehadaku.routes.js";
import kuramanimeRouter from "@routes/kuramanime.routes.js";
import setPayload from "@helpers/setPayload.js";
import cors from "cors";
import connectDB from "@configs/db.js";

// Initialize configs after DB connection
connectDB().then(async () => {
  try {
    const { initializeSourceConfigs } = await import('./utils/sourceConfigInit.js');
    await initializeSourceConfigs();
  } catch (error) {
    console.error('Failed to initialize source configs:', error);
  }
});

const { PORT } = appConfig;
const app = express();

import authRoutes from "@routes/auth.routes.js";
import userRoutes from "@routes/user.routes.js";
import adminRoutes from "@routes/admin.routes.js";

app.use(cors());
app.use(express.json());
// app.use(clientCache(1)); // Optional


app.get("/api", (req, res) => {
  const routes: IRouteData[] = [
    {
      method: "GET",
      path: "/otakudesu",
      description: "Otakudesu",
      pathParams: [],
      queryParams: [],
    },
    {
      method: "GET",
      path: "/kuramanime",
      description: "Kuramanime",
      pathParams: [],
      queryParams: [],
    },
  ];

  res.json(
    setPayload(res, {
      data: { routes },
    })
  );
});

app.use("/api/otakudesu", otakudesuRouter);
app.use("/api/kuramanime", kuramanimeRouter);
app.use("/api/samehadaku", samehadakuRouter);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Admin Panel
app.use('/admin', express.static(path.join(__dirname, '../../admin-panel/dist')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../admin-panel/dist/index.html'));
});

// Serve Frontend
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req, res) => {
  // Check if request is for API to avoid returning HTML for 404 API calls
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
