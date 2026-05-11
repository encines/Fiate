export async function getAIPlanForCar(brand: string, modelName: string, year: number) {
  const apiKey = process.env.GOOGLE_API_KEY?.replace(/"/g, "");
  
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY no configurada.");
  }

  const prompt = `
    Eres un experto mecánico automotriz. Genera un plan de mantenimiento preventivo oficial para un ${brand} ${modelName} año ${year} en México.
    
    Devuelve ÚNICAMENTE un arreglo JSON con el siguiente formato, sin texto adicional ni bloques de código:
    [
       {"name": "Nombre de la tarea", "km": frecuencia_en_km},
      ...
    ]

    Incluye tareas como cambio de aceite, filtros, bujías, frenos, bandas y cualquier servicio específico importante para este modelo.
    Usa frecuencias realistas de manual de servicio (ej: 10000, 20000, 40000, 100000).
  `;

  // Intentamos con FETCH directo para evitar problemas del SDK
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

  try {
    console.log("Intentando petición directa con FETCH...");
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Respuesta cruda de Google Error:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || "Error en la API de Google");
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("DETALLE DEL ERROR FINAL:", message);
    throw new Error("No se pudo obtener el plan de la IA.");
  }
}
