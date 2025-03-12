
import { TradeRecommendation, TradingSymbol } from "@/types/trade.types";

// Mapping from symbol to typical price range and descriptions
const symbolInfo = {
  XAUUSD: {
    name: "Gold",
    alphaVantageSymbol: "XAUUSD",
    priceRange: { base: 2300, variance: 100 }, // Fallback values if API fails
    bullishDesc: [
      "Gold showing strong bullish momentum with a break above the 50-day moving average. RSI indicates momentum is building while inflation fears are driving safe haven demand.",
      "Double bottom pattern forming on the 4-hour chart with increasing volume. MACD crossover signals potential upward momentum.",
      "Fibonacci retracement level providing strong support with bullish candlestick pattern. Dollar weakness providing tailwind for gold prices."
    ],
    bearishDesc: [
      "Gold is facing resistance at key level with bearish divergence on RSI. Market sentiment is shifting as central banks signal hawkish policy stance.",
      "Head and shoulders pattern completed with breakdown below neckline. Volume increasing on selling pressure.",
      "Price failed to break resistance level with bearish engulfing pattern. Strong dollar and rising yields putting pressure on gold."
    ]
  },
  XAGUSD: {
    name: "Silver",
    alphaVantageSymbol: "XAGUSD",
    priceRange: { base: 28, variance: 2 },
    bullishDesc: [
      "Silver breaking out of consolidation pattern with increasing volume. Industrial demand projected to rise with green energy transition.",
      "Bullish flag pattern forming on daily chart with silver/gold ratio suggesting undervaluation. RSI showing early signs of bullish momentum.",
      "Multiple technical indicators aligning with positive divergence on MACD. Manufacturing data suggests increasing industrial demand."
    ],
    bearishDesc: [
      "Silver rejected at key resistance level with overbought RSI reading. Recent rally showing signs of exhaustion.",
      "Industrial demand concerns weighing on silver prices as manufacturing PMIs decline globally. Double top pattern forming on 4-hour chart.",
      "Silver struggling against strengthening dollar index with bearish engulfing pattern on daily timeframe."
    ]
  },
  EURUSD: {
    name: "EUR/USD",
    alphaVantageSymbol: "EURUSD",
    priceRange: { base: 1.08, variance: 0.02 },
    bullishDesc: [
      "EUR/USD forming ascending triangle pattern with ECB hawkish comments supporting Euro strength. Dollar showing signs of weakness.",
      "Positive economic data from Eurozone pushing EUR higher. Breakout above 200-day moving average with increasing volume.",
      "Bullish divergence on RSI with price breaking previous resistance level. Interest rate differential narrowing in favor of Euro."
    ],
    bearishDesc: [
      "EUR/USD rejected at resistance with bearish divergence on RSI. Eurozone economic outlook deteriorating relative to US.",
      "Head and shoulders pattern forming with neckline support under pressure. Fed's hawkish stance strengthening dollar.",
      "Triple top pattern with decreasing volume on rallies. Eurozone PMI data showing contraction in manufacturing sector."
    ]
  },
  USDJPY: {
    name: "USD/JPY",
    alphaVantageSymbol: "USDJPY",
    priceRange: { base: 150, variance: 3 },
    bullishDesc: [
      "USD/JPY breaking resistance with widening interest rate differential. BoJ maintaining dovish stance while Fed remains hawkish.",
      "Ascending channel intact with price bouncing off support trendline. Japanese officials showing tolerance for Yen weakness.",
      "Cup and handle pattern completing with breakthrough above resistance. Yield curve control policy continuing to pressure Yen."
    ],
    bearishDesc: [
      "USD/JPY reaching overbought levels with Japanese officials signaling intervention concerns. Risk of verbal and actual intervention increasing.",
      "Double top pattern forming at historical resistance level. Safe-haven flows supporting Yen as global uncertainties rise.",
      "Bearish divergence on multiple timeframes with signs of exhaustion in the uptrend. Positioning extremely stretched."
    ]
  },
  BTCUSD: {
    name: "Bitcoin",
    alphaVantageSymbol: "BTCUSD",
    priceRange: { base: 62000, variance: 4000 },
    bullishDesc: [
      "Bitcoin forming bullish flag pattern after ETF-related rally. Institutional adoption continuing to increase with strong on-chain metrics.",
      "Breakout above previous resistance with increasing volume. Supply metrics showing decreased selling pressure from long-term holders.",
      "Golden cross forming on daily chart with relative strength against traditional markets. Hash rate at all-time high suggesting network strength."
    ],
    bearishDesc: [
      "Bitcoin rejected at key resistance with decreasing volume. Exchange inflows increasing suggesting potential distribution phase.",
      "Death cross forming on daily chart with bearish divergence on RSI. Mining difficulty adjustment pressuring smaller miners.",
      "Descending triangle pattern with lower highs forming. Regulatory concerns weighing on sentiment as global authorities increase scrutiny."
    ]
  },
  SPX500: {
    name: "S&P 500",
    alphaVantageSymbol: "SPX",
    priceRange: { base: 5200, variance: 200 },
    bullishDesc: [
      "S&P 500 breaking to new all-time highs with broad-based participation. Economic data supporting soft landing narrative.",
      "Cup and handle pattern completing with breakout above resistance. Earnings reports exceeding expectations across multiple sectors.",
      "Bullish golden cross on daily chart with improving breadth indicators. Fed pivot expectations supporting risk assets."
    ],
    bearishDesc: [
      "S&P 500 showing distribution pattern at all-time highs with declining volume. Advance-decline line weakening despite index strength.",
      "Double top pattern with bearish divergence on RSI. Valuations stretched beyond historical norms as earnings growth slows.",
      "Head and shoulders pattern forming with narrowing market breadth. Economic indicators suggesting slowdown in consumer spending."
    ]
  }
};

// Cache for price data to avoid excessive API calls
const priceCache: Record<string, { price: number, timestamp: number }> = {};
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Alpha Vantage API key - using demo key for simplicity
// In a production environment, this should be stored securely
const ALPHA_VANTAGE_API_KEY = "demo";

// Get current price from Alpha Vantage API
const fetchCurrentPrice = async (symbol: TradingSymbol): Promise<number> => {
  const info = symbolInfo[symbol];
  const alphaSymbol = info.alphaVantageSymbol;
  
  // Check cache first
  const now = Date.now();
  if (priceCache[symbol] && (now - priceCache[symbol].timestamp) < CACHE_EXPIRY) {
    console.log(`Using cached price for ${symbol}: ${priceCache[symbol].price}`);
    return priceCache[symbol].price;
  }
  
  try {
    // Choose the appropriate API endpoint based on the symbol
    let url;
    if (symbol === 'SPX500') {
      url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaSymbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    } else if (symbol === 'BTCUSD') {
      url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=${ALPHA_VANTAGE_API_KEY}`;
    } else if (symbol === 'XAUUSD' || symbol === 'XAGUSD') {
      url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${alphaSymbol.substring(0, 3)}&to_currency=${alphaSymbol.substring(3)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    } else {
      // For forex pairs like EURUSD, USDJPY
      url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${alphaSymbol.substring(0, 3)}&to_currency=${alphaSymbol.substring(3)}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    }
    
    console.log(`Fetching price for ${symbol} from Alpha Vantage...`);
    const response = await fetch(url);
    const data = await response.json();
    
    let price;
    if (symbol === 'SPX500') {
      price = parseFloat(data['Global Quote']['05. price']);
    } else {
      price = parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    }
    
    // Cache the result
    priceCache[symbol] = { price, timestamp: now };
    
    console.log(`Got price for ${symbol}: ${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    // Fallback to simulated price in case of API error
    const fallbackPrice = info.priceRange.base + (Math.random() * info.priceRange.variance - info.priceRange.variance/2);
    console.log(`Using fallback price for ${symbol}: ${fallbackPrice}`);
    return fallbackPrice;
  }
};

// Get recommendations for a specific symbol
export const getSymbolRecommendations = async (symbol: TradingSymbol): Promise<TradeRecommendation[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const info = symbolInfo[symbol];
  
  try {
    // Get real current price
    const currentPrice = await fetchCurrentPrice(symbol);
    
    // Create some recommendations
    const recommendations: TradeRecommendation[] = [
      createRecommendation(`rec1-${symbol}`, symbol, currentPrice, info, 0),
      createRecommendation(`rec2-${symbol}`, symbol, currentPrice, info, 1, new Date(Date.now() - 3600000)),
      createRecommendation(`rec3-${symbol}`, symbol, currentPrice, info, 2, new Date(Date.now() - 7200000))
    ];
    
    return recommendations;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error(`Failed to generate recommendations for ${symbol}`);
  }
};

// Helper function to create consistent recommendation objects
const createRecommendation = (
  id: string, 
  symbol: TradingSymbol, 
  currentPrice: number, 
  info: any, 
  index: number,
  timestamp: Date = new Date()
): TradeRecommendation => {
  // Determine direction first so we can use it consistently
  const direction = Math.random() > 0.5 ? "long" : "short";
  
  // Use the appropriate description based on direction
  const rationale = direction === "long" 
    ? info.bullishDesc[Math.floor(Math.random() * info.bullishDesc.length)]
    : info.bearishDesc[Math.floor(Math.random() * info.bearishDesc.length)];
  
  // Set appropriate stop loss and take profit levels based on direction
  const entryPrice = currentPrice - (Math.random() * currentPrice * 0.01 - currentPrice * 0.005);
  const stopLoss = direction === "long" 
    ? entryPrice * 0.98  // 2% below entry for longs
    : entryPrice * 1.02; // 2% above entry for shorts
  
  const takeProfit = direction === "long"
    ? entryPrice * 1.04  // 4% above entry for longs
    : entryPrice * 0.96; // 4% below entry for shorts
  
  // Sources based on index to ensure variety
  const sources = [
    ["TradingView Analysis", "Bloomberg Market Analysis", "Goldman Sachs Research", "JPMorgan Technical Strategy"],
    ["Morgan Stanley Research", "Citi Technical Analysis", "Bank of America Merrill Lynch", "Barclays Capital"],
    ["Deutsche Bank Strategy", "UBS Technical Analysis", "HSBC Global Research", "Credit Suisse Markets"]
  ];
  
  return {
    id,
    symbol,
    direction,
    currentPrice,
    entryPrice,
    stopLoss,
    takeProfit,
    rationale,
    source: sources[index][Math.floor(Math.random() * 4)],
    timestamp,
    strength: Math.random() > 0.7 ? "strong" : (Math.random() > 0.5 ? "moderate" : "weak")
  };
};

// For backward compatibility
export const getGoldRecommendations = async (): Promise<TradeRecommendation[]> => {
  return getSymbolRecommendations("XAUUSD");
};
