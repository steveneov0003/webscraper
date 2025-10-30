import puppeteer, { Browser, Page } from 'puppeteer';

export interface ScrapedTrade {
  id: string;
  symbol: string;
  type: 'Buy' | 'Sell';
  size: number;
  entryPrice: number;
  currentPnl: number;
  leverage: number;
  openTime: Date;
}

const BYBIT_URL = 'https://www.bybit.com/copyMt5/trade-center/detail?providerMark=LKxdqx0s95ebyvGkS3uP9w%3D%3D&copyFrom=CTIndex&profileDay=7';
const TIMEOUT = 30000;

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    browserInstance = await puppeteer.launch({
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
      ],
    });
  }
  return browserInstance;
}

export async function scrapeBybitTrades(): Promise<ScrapedTrade[]> {
  let page: Page | null = null;
  
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    console.log(`[Scraper] Navigating to Bybit page...`);
    await page.goto(BYBIT_URL, {
      waitUntil: 'domcontentloaded',
      timeout: TIMEOUT,
    });
    
    await page.waitForTimeout(5000);
    
    console.log(`[Scraper] Taking screenshot for debugging...`);
    await page.screenshot({ path: '/tmp/bybit-page.png' });
    
    console.log(`[Scraper] Looking for trade elements...`);
    const possibleSelectors = [
      'table',
      '[data-testid*="trade"]',
      '[class*="trade"]',
      '[class*="position"]',
      'div[role="table"]',
      'div[role="grid"]',
    ];
    
    let foundSelector: string | null = null;
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 5000 });
        foundSelector = selector;
        console.log(`[Scraper] Found selector: ${selector}`);
        break;
      } catch (e) {
        continue;
      }
    }
    
    if (!foundSelector) {
      const html = await page.content();
      console.log(`[Scraper] Page HTML length: ${html.length}`);
      throw new Error('No table or trade list found on page. The page structure might have changed.');
    }
    
    console.log(`[Scraper] Extracting trade data using selector: ${foundSelector}...`);
    const trades = await page.evaluate((selector) => {
      const rows = document.querySelectorAll('table tbody tr');
      const extractedTrades: any[] = [];
      
      rows.forEach((row, index) => {
        try {
          const cells = row.querySelectorAll('td');
          if (cells.length === 0) return;
          
          const symbolElement = cells[0]?.textContent?.trim();
          const typeElement = cells[1]?.textContent?.trim();
          const sizeElement = cells[2]?.textContent?.trim();
          const entryPriceElement = cells[3]?.textContent?.trim();
          const pnlElement = cells[4]?.textContent?.trim();
          const leverageElement = cells[5]?.textContent?.trim();
          const timeElement = cells[6]?.textContent?.trim();
          
          if (!symbolElement || !typeElement) return;
          
          const parsePnL = (pnl: string | undefined): number => {
            if (!pnl) return 0;
            const cleaned = pnl.replace(/[^0-9.-]/g, '');
            return parseFloat(cleaned) || 0;
          };
          
          const parseNumber = (value: string | undefined): number => {
            if (!value) return 0;
            const cleaned = value.replace(/[^0-9.]/g, '');
            return parseFloat(cleaned) || 0;
          };
          
          const parseLeverage = (lev: string | undefined): number => {
            if (!lev) return 1;
            const match = lev.match(/(\d+)x?/i);
            return match ? parseInt(match[1]) : 1;
          };
          
          const parseTime = (time: string | undefined): string => {
            if (!time) return new Date().toISOString();
            
            const now = new Date();
            const minutesMatch = time.match(/(\d+)\s*m/i);
            const hoursMatch = time.match(/(\d+)\s*h/i);
            const daysMatch = time.match(/(\d+)\s*d/i);
            
            if (minutesMatch) {
              now.setMinutes(now.getMinutes() - parseInt(minutesMatch[1]));
            } else if (hoursMatch) {
              now.setHours(now.getHours() - parseInt(hoursMatch[1]));
            } else if (daysMatch) {
              now.setDate(now.getDate() - parseInt(daysMatch[1]));
            }
            
            return now.toISOString();
          };
          
          const trade = {
            id: `trade-${index}-${Date.now()}`,
            symbol: symbolElement,
            type: typeElement.toLowerCase().includes('buy') ? 'Buy' : 'Sell',
            size: parseNumber(sizeElement),
            entryPrice: parseNumber(entryPriceElement),
            currentPnl: parsePnL(pnlElement),
            leverage: parseLeverage(leverageElement),
            openTime: parseTime(timeElement),
          };
          
          extractedTrades.push(trade);
        } catch (error) {
          console.error('Error parsing trade row:', error);
        }
      });
      
      return extractedTrades;
    }, foundSelector);
    
    const formattedTrades: ScrapedTrade[] = trades.map(trade => ({
      ...trade,
      openTime: new Date(trade.openTime),
    }));
    
    console.log(`[Scraper] Successfully extracted ${formattedTrades.length} trades`);
    
    if (formattedTrades.length === 0) {
      throw new Error('No trades found on the page. The trader might not have any open positions.');
    }
    
    return formattedTrades;
    
  } catch (error) {
    console.error('[Scraper] Error scraping Bybit trades:', error);
    throw new Error(`Failed to scrape trades: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (page) {
      await page.close();
    }
  }
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

process.on('exit', () => {
  if (browserInstance) {
    browserInstance.close();
  }
});
