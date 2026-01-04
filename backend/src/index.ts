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
// Serve Frontend with custom cache headers for index.html
app.use(express.static(path.join(__dirname, '../../frontend/dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

app.get('*', (req, res) => {
  // Check if request is for API to avoid returning HTML for 404 API calls
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  // Disable caching for index.html to ensure latest deployment is always loaded
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`server is running on http://localhost:${PORT}`);

  // DEBUG: Check IP Address through Proxy
  try {
    const fetch = (await import("node-fetch")).default;
    const { SocksProxyAgent } = await import("socks-proxy-agent");

    let agent: any = undefined;
    if (process.env.SOCKS_PROXY) {
      agent = new SocksProxyAgent(process.env.SOCKS_PROXY);
      console.log("[Debug] Testing Proxy connection...");
    }

    const res = await fetch("https://ifconfig.me/ip", { agent });
    const ip = await res.text();
    console.log(`[Debug] Current Egress IP: ${ip.trim()}`);

    if (process.env.SOCKS_PROXY && !ip.includes(".")) {
      // Basic check if we got a valid-ish response (IPv4/IPv6)
      console.log("[Debug] Warning: IP response looks invalid: " + ip);
    }
  } catch (err) {
    console.error("[Debug] Failed to check IP:", err);
  }
});
