import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Serve the built Vite files
app.use(express.static(distPath, { index: false, maxAge: '1y' }));

// SPA fallback: send index.html for any other GET request (works on Express 4 and 5)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
