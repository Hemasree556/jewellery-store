import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy-initialized Gemini client to prevent crash if key is mock or missing during warm up.
let googleAiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!googleAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not configured yet. Set it in the Secrets panel.");
    }
    googleAiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return googleAiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // 1. AI Recommendation Proxy Endpoint
  app.post("/api/recommend", async (req, res) => {
    try {
      const { preference, metalType, occasion, budgetRange, category } = req.body;

      // Construct elegant prompts for high carat luxury jewelry consultations
      const prompt = `You are the elite digital jewelry curator and head of bespoke concierge at HAARA, a prestigious luxury jewelry house.
Analyze the customer's request and suggest highly specific design cues, styles from HAARA collections, metals, and gemstones.

Customer Consultation Details:
- Category Interested: ${category || "General fine jewelry"}
- Preferred Metal: ${metalType || "Gold or Platinum"}
- Occasion: ${occasion || "Galas & Elegance"}
- Budget Range: ${budgetRange || "Premium Selection"}
- Focus/Custom Preferences: ${preference || "None specified, looking for something classic and breathtaking"}

Formulate an elite response as a JSON object matching the exact key signatures below:
- analysis: A paragraphs explaining why this combination works, the visual weight, and style matching advice.
- suggestedStyles: An array of 3 distinct, beautifully named custom jewelry styles or pieces (e.g. "The Empress Solitaire Ring with Filigree detailing").
- tips: An array of 3 practical gold maintenance or gemstones care tips tailored to their selection.

Produce only raw, strict JSON. Do not wrap with markdown headers or backticks outside of what the schema specifies.`;

      // Acquire initialized gemini client lazily
      const ai = getGeminiClient();

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { type: Type.STRING },
              suggestedStyles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              tips: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["analysis", "suggestedStyles", "tips"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Invalid response received from Gemini AI.");
      }

      // Parse JSON directly and send back
      const recommendationData = JSON.parse(responseText.trim());
      res.json(recommendationData);

    } catch (error: any) {
      console.error("Gemini AI integration error:", error.message || error);
      
      // Graceful fallback advice if Gemini is unavailable
      res.status(200).json({
        analysis: "Greetings from the HAARA Atelier. We are carefully detailing your requirements. Based on your luxury selection, we highly recommend a high-gloss yellow gold or high-purity platinum finish. Deep pavé diamond arrangements matched with structural contours harmonize perfectly on formal occasions. Ensure you schedule a personal consultation to witness the physical items under show-glass.",
        suggestedStyles: [
          `Signature Custom ${req.body.category || "Jewelry"} with Fine Filigree Contour`,
          `Atelier Solitaire Custom Selection with Pavé Halo`,
          `Legacy Emerald or Sapphire Crowned Statement Piece`
        ],
        tips: [
          "Always wipe precious metals with specialized dry microfiber chamois after wearing to clear natural body oils.",
          "Prevent spraying high-concentration perfumes or hair sprays directly onto diamonds, as it clouds overall facet scintillation.",
          "Examine gold prong tips annually at HAARA showroom to secure stones against daily friction release."
        ],
        isFallback: true,
        errorMessage: error.message || ""
      });
    }
  });

  // 2. Vite Dev Server Middleware or Production Static Server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[HAARA SERVER] running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`);
  });
}

startServer();
