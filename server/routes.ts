import type { Express } from "express";
import { createServer, type Server } from "http";
import NodeCache from "node-cache";
import { scrapeBybitTrades } from "./scraper";

const cache = new NodeCache({ stdTTL: 30 });
const CACHE_KEY = 'bybit_trades';

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/trades', async (req, res) => {
    try {
      const cachedData = cache.get(CACHE_KEY);
      
      if (cachedData) {
        console.log('[API] Returning cached trade data');
        return res.json({
          success: true,
          data: cachedData,
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }
      
      console.log('[API] Cache miss, scraping fresh data...');
      const trades = await scrapeBybitTrades();
      
      cache.set(CACHE_KEY, trades);
      
      res.json({
        success: true,
        data: trades,
        cached: false,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error('[API] Error fetching trades:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trades',
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
