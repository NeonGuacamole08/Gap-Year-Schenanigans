import express, { Request, Response } from 'express';
import { parseVisionBoardImage, verifyProofPhoto } from './geminiService';

export const app = express();

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.get('/api/health', (req: Request, res: Response) => {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
  res.json({
    status: 'ok',
    serene_engine: 'active',
    gemini_connected: hasKey,
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/vision/parse', async (req: Request, res: Response) => {
  try {
    const { base64Image, mimeType, notes } = req.body;
    console.log('[Serene Server] Parsing vision board request received');
    const result = await parseVisionBoardImage(base64Image, mimeType, notes);
    res.json(result);
  } catch (error: any) {
    console.error('[Serene Server] /api/vision/parse error:', error);
    res.status(500).json({
      error: 'Failed to gently parse vision board',
      message: error?.message || 'Unknown error',
    });
  }
});

app.post('/api/vision/verify', async (req: Request, res: Response) => {
  try {
    const { base64Image, mimeType, goalId, goalContext, note } = req.body;
    console.log(`[Serene Server] Verifying proof check-in for goal: ${goalId}`);
    const result = await verifyProofPhoto(base64Image, mimeType, goalId, goalContext, note);
    res.json(result);
  } catch (error: any) {
    console.error('[Serene Server] /api/vision/verify error:', error);
    res.status(500).json({
      error: 'Failed to verify proof',
      message: error?.message || 'Unknown error',
    });
  }
});
