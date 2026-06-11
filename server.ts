import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Define the system instructions for SkullGamer AI
  const systemInstruction = `Eres SkullGamer AI, un asistente técnico virtual experto en hardware de computación de alta gama y componentes de PC. Tu objetivo es asesorar a los usuarios para que armen la PC ideal según su presupuesto, necesidades de trabajo o los videojuegos que quieren correr.

Tus reglas de comportamiento son:
- Serás siempre amable, técnico, preciso y profesional.
- Te basarás únicamente en el catálogo de productos disponibles que se te proporciona a continuación. Si el usuario te pide un componente que no está en la lista, ofrécele la alternativa más cercana que sí esté disponible.
- Cuando el usuario te pida un presupuesto o recomendación, arma un desglose claro con los precios de cada componente y calcula el monto total acumulado.
- Al finalizar tu recomendación, incluye un llamado a la acción invitando al usuario a confirmar su pedido para enviarlo por WhatsApp.

### CATÁLOGO DE PRODUCTOS DISPONIBLES (Precios en USD)

[PROCESADORES / CPU]
- AMD Ryzen 5 5600X (Ideal calidad/precio) - $160
- AMD Ryzen 7 5700X3D (Excelente para gaming) - $240
- Intel Core i5-12400F (Económico y rendidor) - $140
- Intel Core i7-13700K (Alta gama / streaming) - $380

[PLACAS MADRE / MOTHERBOARD]
- Asus Prime H610M-E (Para Intel 12va/13va gen, económica) - $85
- MSI MAG B550 Tomahawk (Para AMD AM4, excelente energía) - $145
- ASUS ROG Strix Z790-F Gaming (Para Intel gama alta) - $310

[PLACAS DE VIDEO / GPU]
- AMD Radeon RX 6600 8GB (Ideal 1080p competitivo) - $230
- NVIDIA RTX 4060 8GB (Soporta DLSS 3 y Ray Tracing) - $320
- NVIDIA RTX 4070 Super 12GB (Para jugar en 1440p / 4K) - $650

[MEMORIA RAM]
- Corsair Vengeance DDR4 16GB (2x8GB) 3200MHz - $55
- Kingston FURY Beast DDR5 32GB (2x16GB) 5200MHz - $120

[ALMACENAMIENTO / DISCOS SSD]
- SSD SATA Crucial BX500 480GB (Económico para sistema) - $40
- SSD NVMe M.2 Kingston NV2 1TB PCIe 4.0 (Rápido y amplio) - $65
- SSD NVMe M.2 WD Black SN850X 1TB (Máxima velocidad gaming) - $95

[GABINETES]
- Sentey G10 (Económico, incluye fan trasero) - $45
- Corsair 4000D Airflow (Excelente flujo de aire, templado) - $95

[FUENTES DE PODER / PSU]
- Gigabyte P650B 650W 80 Plus Bronze - $60
- Corsair RM750e 750W 80 Plus Gold Modular - $110`;

  // Provide initial message
  const initialGreeting = "¡Hola! Soy SkullGamer AI, tu asistente experto en hardware para armar la PC de tus sueños. DIME, ¿cuál es tu presupuesto o qué tipo de uso le darás a tu nueva computadora (gaming competitivo, streaming, diseño, etc.)?";

  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is required." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const formattedHistory = [
        ...history.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        }))
      ];
      
      let response;
      let lastError;
      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      
      for (const currentModel of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: currentModel,
            contents: [
              ...formattedHistory,
              { role: "user", parts: [{ text: message }] }
            ],
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            }
          });
          break; // Generación exitosa, rompemos el ciclo
        } catch (err: any) {
          console.warn(`Error con el modelo ${currentModel}:`, err.message);
          lastError = err;
          // Si es un error 503 (alta demanda) o 429 (cuota excedida), probamos el siguiente modelo
          const is503 = err?.status === 503 || err?.message?.includes('503') || err?.message?.includes('high demand');
          const is429 = err?.status === 429 || err?.status === 'RESOURCE_EXHAUSTED' || err?.message?.includes('429') || err?.message?.includes('exceeded your current quota');
          if (is503 || is429) {
            continue;
          } else {
            break; // Si es otro tipo de error, detenemos los reintentos
          }
        }
      }
      
      if (!response) {
        throw lastError;
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let errorMessage = "Hubo un error al comunicarse con la IA.";
      if (error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('high demand')) {
        errorMessage = "El servidor de IA está experimentando alta demanda. Por favor, intenta nuevamente en unos momentos.";
      } else if (error?.status === 429 || error?.status === 'RESOURCE_EXHAUSTED' || error?.message?.includes('429') || error?.message?.includes('exceeded your current quota')) {
        errorMessage = "Los servidores de IA han excedido su límite de uso. Por favor, intenta un poco más tarde.";
      }
      
      res.status(500).json({ error: errorMessage, details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vitePkg = "vite";
    import(vitePkg).then(async (vite) => {
      const viteServer = await vite.createServer({
        server: { middlewareMode: true, hmr: false },
        appType: "spa",
      });
      app.use(viteServer.middlewares);
      
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    }).catch(console.error);
  } else {
    // In production (Vercel or node dist/server.cjs)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    // Only listen if not being imported by Vercel serverless functions
    if (process.argv[1] && process.argv[1].endsWith('server.cjs')) {
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Production server running on http://localhost:${PORT}`);
        });
    }
  }

export default app;
