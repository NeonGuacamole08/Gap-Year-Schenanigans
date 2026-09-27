import { app } from './server/app';
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const distPath = path.resolve(process.cwd(), 'dist');

// Serve static frontend assets from dist in production
app.use(express.static(distPath));

// Fallback all non-API GET requests to index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[Serene Server] Listening serenely on port ${port}`);
});
