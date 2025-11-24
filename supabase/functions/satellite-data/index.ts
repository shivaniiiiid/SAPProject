import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { bbox, fromDate, toDate, latitude, longitude } = body;

    const clientId = Deno.env.get("SENTINELHUB_CLIENT_ID");
    const clientSecret = Deno.env.get("SENTINELHUB_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      throw new Error("SentinelHub credentials missing");
    }

    // -----------------------------
    // 1️⃣ FIXED BBOX AUTOGENERATION
    // -----------------------------
    let useBbox = bbox;

    if (!useBbox && latitude && longitude) {
      const buffer = 0.03; // 3km box
      useBbox = [
        Number(longitude) - buffer,
        Number(latitude) - buffer,
        Number(longitude) + buffer,
        Number(latitude) + buffer,
      ];
    }

    if (!useBbox) {
      throw new Error("Either bbox or coordinates required");
    }

    // -----------------------------
    // 2️⃣ FIXED ISO DATES
    // -----------------------------
    const cleanTo =
      toDate?.replace(/\.\d+Z$/, "Z") ||
      new Date().toISOString().replace(/\.\d+Z$/, "Z");

    const cleanFrom =
      fromDate?.replace(/\.\d+Z$/, "Z") ||
      new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/\.\d+Z$/, "Z");

    // -----------------------------
    // 3️⃣ AUTH TOKEN
    // -----------------------------
    const tokenResponse = await fetch(
      "https://services.sentinel-hub.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:
          `grant_type=client_credentials` +
          `&client_id=${clientId}` +
          `&client_secret=${clientSecret}`,
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("SentinelHub authentication failed");
    }

    const { access_token } = await tokenResponse.json();

    // -----------------------------
    // 4️⃣ EVALSCRIPT (NEW FORMAT)
    // -----------------------------
    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: [{
            bands: ["B04", "B08", "B11"],
            units: "REFLECTANCE"
          }],
          output: [
            { id: "ndvi", sampleType: "FLOAT32", bands: 1 },
            { id: "temp", sampleType: "FLOAT32", bands: 1 }
          ]
        };
      }

      function evaluatePixel(s) {
        let ndvi = (s.B08 - s.B04) / (s.B08 + s.B04 + 0.0001);
        let temp = 23 + (s.B11 * 55);  // Better temperature estimate
        return {
          ndvi: [ndvi],
          temp: [temp]
        };
      }
    `;

    // -----------------------------
    // 5️⃣ STATISTICS API BODY
    // -----------------------------
    const statsBody = {
      input: {
        bounds: {
          bbox: useBbox,
          properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" },
        },
        data: [
          {
            type: "sentinel-2-l2a",
            dataFilter: {
              timeRange: { from: cleanFrom, to: cleanTo },
              maxCloudCoverage: 40,
            },
          },
        ],
