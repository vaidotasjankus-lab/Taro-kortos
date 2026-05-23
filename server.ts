import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Parse JSON bodies
app.use(express.json());

// Lazy client helper with fallback keys support to bypass locked platform secrets
function getGeminiClient(): GoogleGenAI {
  // Patikriname kelis galimus kintamuosius, leidžiant vartotojui lengvai apeiti užrakintą GEMINI_API_KEY nustatymą
  const apiKey = process.env.Taro || process.env.TARO || process.env.CUSTOM_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("API_KEY_NOT_CONFIGURED");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Lithuanian category name mapper for the prompt
const categoriesMap: Record<string, string> = {
  meile: "Meilė ir santykiai",
  darbas: "Darbas ir karjera",
  finansai: "Finansai ir pinigai",
  sveikata: "Sveikata ir savijauta",
  santykiai: "Santykių dinamika",
  situacija: "Bendra gyvenimo situacija"
};

// Lithuanian spread combination name mapper
const combinationsMap: Record<string, string> = {
  viena_korta: "Vienos kortos aiškinimas (Greitas atsakymas)",
  trys_kortos: "Trijų kortų dėlionė (Praeitis, Dabartis, Ateitis)",
  keltu_kryzius: "Keltų kryžiaus dėlionė (10 kortų gilus tyrimas)"
};

// API Endpoint for Tarot Reading
app.post("/api/tarot", async (req, res) => {
  try {
    const { question, category, combination, cards, theme } = req.body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ error: "Nepateiktos pasirinktos Taro kortos." });
    }

    const categoryText = categoriesMap[category] || category || "Bendra";
    const combinationText = combinationsMap[combination] || combination;
    
    // Construct active card descriptions for the AI prompt
    const cardDescriptions = cards.map((c: any, index: number) => {
      const positionStr = c.positionName ? `Pozicija: ${c.positionName}` : `Korta #${index + 1}`;
      const orientationStr = c.isReversed ? "APVERSTA" : "STATIONARI (Teisinga)";
      return `- IR_KORTOS_ID: "${c.id}" - [${positionStr}] ${c.name} (${c.originalName}) - padėtis: ${orientationStr}.`;
    }).join("\n");

    const prompt = `
Tu esi išmintingas, paslaptingas, giliai empatiškas Taro kortų meistras ir orakulas. 
Atsakyk lietuvių kalba, kūrybišku, giliu, mistišku, bet praktišku tonu (suvokiant, kad žmogus ieško tikro gyvenimo kelio).

Vartotojo klausimas: "${question || "Bendra gyvenimo kryptis ir įžvalga"}"
Tema/Kategorija: ${categoryText}
Dėlionės tipas: ${combinationText}

Iškritusios kortos:
${cardDescriptions}

Atsižvelgdamas į kortų padėtį (apverstos kortos simbolizuoja užblokuotą energiją, vidinius konfliktus arba priešingą reikšmę) bei jų pozicijas dėlionėje, pateik išsamią interpretaciją.
Kiekvienos kortos individualus paaiškinimas ("meaning") privalo būti gilus, bet koncentruotas ir susidėti iš 2–3 prasmingų sakinių.

SVARBU: Atsakyk TIKŠLIAI pagal pateiktą JSON schemą. Neviršyk schemos ribų ir nepridėk jokio kito teksto aplink JSON.
Lauke "cardId" nurodyk tikslią atitinkamos kortos "IR_KORTOS_ID" reikšmę (pvz., "major-2" arba "minor-swords-7").
`;

    const systemInstruction = `
Esi giliausias Taro kortų interpretuotojas. Kalbi lietuvių kalba. 
Tavo atsakymai turi būti mistiški, literatūriškai gražūs, įkvepiantys, tačiau suteikiantys aiškių įžvalgų.
Kiekvienos kortos gilus išaiškinimas ("meaning") privalo būti gilus, bet koncentruotas (tiksliai 2–3 prasmingi sakiniai), susiejant kortos archetipą ir padėtį su vartotojo klausimu bei jos pozicija dėlionėje.
Laikykitės nurodytų "IR_KORTOS_ID" reikšmių lauke "cardId".
`;

    // Get Gemini client lazily (throws if API key is not configured)
    const ai = getGeminiClient();

    // Call Gemini using gemini-3.5-flash with structured JSON response
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["summary", "cardsInterpretation", "guidance", "outlook"],
          properties: {
            summary: {
              type: Type.STRING,
              description: "Apibendrinanti įžvalga apie visą dėlionę lietuvių kalba, sujungianti klausimą ir kortų bendrą nuotaiką."
            },
            cardsInterpretation: {
              type: Type.ARRAY,
              description: "Kiekvienos ištrauktos kortos individualus gilus aiškinimas pagal jos ištraukta poziciją.",
              items: {
                type: Type.OBJECT,
                required: ["cardId", "positionName", "meaning"],
                properties: {
                  cardId: {
                    type: Type.STRING,
                    description: "Kortos identifikatorius (id), kuris turi tiksliai sutapti su atitinkamos kortos IR_KORTOS_ID."
                  },
                  positionName: {
                    type: Type.STRING,
                    description: "Pozicijos pavadinimas, pvz., 'Praeitis', 'Ateitis', 'Svečias'."
                  },
                  meaning: {
                    type: Type.STRING,
                    description: "Koncentruotas, gilus 2–3 sakinių reikšmės aprašymas lietuviškai šiai kortai šioje konkrečioje padėtyje."
                  }
                }
              }
            },
            guidance: {
              type: Type.STRING,
              description: "Išmintingas, konkretus patarimas arba gairė (patarimų korta ar elgesio kryptis)."
            },
            outlook: {
              type: Type.STRING,
              description: "Tolimesnė perspektyva ar apibendrinamasis palinkėjimas ateičiai."
            }
          }
        }
      }
    });

    const replyText = response.text;
    if (!replyText) {
      throw new Error("Gemini negrąžino jokio teksto.");
    }

    const parsedResponse = JSON.parse(replyText.trim());
    return res.json(parsedResponse);
  } catch (error: any) {
    console.error("Klaida apdorojant taro būrimą:", error);
    let errorMsg = "Nepavyko atlikti Taro kortų interpretacijos. Bandykite dar kartą.";

    if (error.message === "API_KEY_NOT_CONFIGURED") {
      errorMsg = "Svarbu: Google Gemini API raktas nėra sukonfigūruotas. Prašome nustatyti GEMINI_API_KEY paspaudus viršuje dešinėje esančią nustatymų (Settings) ikonėlę ir įvedus veikiantį API raktą.";
    } else if (error.message && (error.message.includes("API_KEY_INVALID") || error.message.includes("key is invalid") || error.message.includes("API key not valid") || error.message.includes("key invalid"))) {
      errorMsg = "Neteisingas Gemini API raktas. Prašome patikrinti suvestą GEMINI_API_KEY reikšmę projekto nustatymuose (Settings panelė viršuje dešinėje).";
    } else if (error.message && (error.message.includes("prepayment credits") || error.message.includes("prepay") || error.message.includes("depleted"))) {
      errorMsg = "Paskyros likutis išnaudotas (Prepayment credits depleted). Google AI Studio lange jūsų projektas turi mokamą planą, bet jame nėra piniginių kreditų lėšų. Norėdami tęsti, papildykite projekto balansą Google AI Studio arba sukurkite visiškai nemokamą raktą naujame/kitaame neprijungtame projekte.";
    } else if (error.message && (error.message.includes("quota") || error.message.includes("Quota exceeded") || error.message.includes("Resource exhausted") || error.message.includes("limit"))) {
      errorMsg = "Viršytas nemokamas užklausų srauto limitas (Quota Exceeded). Palaukite vieną minutę, kol atsinaujins užklausų langas, ir bandykite dar kartą.";
    }

    return res.status(500).json({ 
      error: errorMsg,
      details: error.message
    });
  }
});

// Configure Vite integration or build asset delivery
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, "index.html"));

  if (process.env.NODE_ENV !== "production" || !hasDist) {
    console.log(`[Server] Naudojami Vite vystytojo tarpiniai sluoksniai (Has dist: ${hasDist})`);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Naudojami statiniai gamybos failai iš dist aplanko");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveris veikia adresu http://0.0.0.0:${PORT}`);
  });
}

startServer();
