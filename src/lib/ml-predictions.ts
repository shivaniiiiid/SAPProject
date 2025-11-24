import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Real ML Model: Crop Disease Detection using Vision API
export async function analyzeCropImageWithML(base64Image: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert agricultural pathologist. Analyze this crop image for:
1. Disease presence (if any)
2. Confidence level (0-100%)
3. Health status: healthy/warning/critical
4. Specific recommendations

Return ONLY valid JSON: {
  "disease": "disease name or null",
  "status": "healthy|warning|critical",
  "confidence": number,
  "symptoms": ["symptom1", "symptom2"],
  "recommendations": ["action1", "action2"],
  "treatmentOptions": ["option1", "option2"]
}`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('ML Image Analysis Error:', error);
    throw new Error('Failed to analyze crop image with ML model');
  }
}

// Real ML Model: Yield Prediction
export async function predictYield(params: {
  soilMoisture: number;
  temperature: number;
  rainfall: number;
  ndvi: number;
  cropType: string;
  daysGrown: number;
  soilPH: number;
  npkLevels: { nitrogen: number; phosphorus: number; potassium: number };
}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are an agricultural yield prediction expert. Based on these crop metrics, predict the yield:

Crop: ${params.cropType}
Soil Moisture: ${params.soilMoisture}%
Temperature: ${params.temperature}°C
Rainfall: ${params.rainfall}mm
NDVI (Crop Health): ${params.ndvi}
Days Grown: ${params.daysGrown}
Soil pH: ${params.soilPH}
NPK Levels: N=${params.npkLevels.nitrogen}, P=${params.npkLevels.phosphorus}, K=${params.npkLevels.potassium}

Predict yield per hectare and provide confidence. Return ONLY JSON:
{
  "predictedYield": number,
  "unit": "kg/ha",
  "confidence": number,
  "factors": {"positive": ["factor1"], "negative": ["factor2"]},
  "recommendations": ["action1", "action2"]
}`
        }
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Yield Prediction Error:', error);
    throw new Error('Failed to predict yield');
  }
}

// Real ML Model: Water Stress Prediction
export async function predictWaterStress(params: {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  evaporationRate: number;
  cropType: string;
  soilType: string;
}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a precision irrigation expert. Predict water stress based on:

Soil Moisture: ${params.soilMoisture}%
Temperature: ${params.temperature}°C
Humidity: ${params.humidity}%
Rainfall: ${params.rainfall}mm
Evaporation Rate: ${params.evaporationRate}mm
Crop: ${params.cropType}
Soil: ${params.soilType}

Return ONLY JSON:
{
  "stressLevel": "low|moderate|high|critical",
  "irrigationUrgency": number,
  "recommendedWater": number,
  "irrigationTiming": "immediate|today|tomorrow|this week",
  "riskFactors": ["factor1", "factor2"],
  "warnings": ["warning1"]
}`
        }
      ],
      max_tokens: 500,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Water Stress Prediction Error:', error);
    throw new Error('Failed to predict water stress');
  }
}

// Real ML Model: Pest Detection
export async function detectPests(params: {
  cropType: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  soilMoisture: number;
  region: string;
}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are an agricultural pest management expert. Assess pest risk for:

Crop: ${params.cropType}
Temperature: ${params.temperature}°C
Humidity: ${params.humidity}%
Rainfall: ${params.rainfall}mm
Soil Moisture: ${params.soilMoisture}%
Region: ${params.region}

Return ONLY JSON:
{
  "riskLevel": "low|moderate|high|critical",
  "likelyPests": ["pest1", "pest2"],
  "conditions": {"favorable": ["condition1"], "unfavorable": ["condition2"]},
  "preventiveMeasures": ["measure1", "measure2"],
  "monitoring": "frequency and what to look for",
  "treatment": {"organic": ["option1"], "chemical": ["option2"]}
}`
        }
      ],
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Pest Detection Error:', error);
    throw new Error('Failed to detect pest risk');
  }
}

// Real ML Model: Nutrient Deficiency Detection
export async function detectNutrientDeficiency(params: {
  cropType: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilPH: number;
  soilType: string;
}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `You are a soil scientist. Analyze nutrient levels:

Crop: ${params.cropType}
Nitrogen: ${params.nitrogen} mg/kg
Phosphorus: ${params.phosphorus} mg/kg
Potassium: ${params.potassium} mg/kg
Soil pH: ${params.soilPH}
Soil Type: ${params.soilType}

Return ONLY JSON:
{
  "deficiencies": [{"nutrient": "name", "severity": "low|medium|high", "impacts": ["impact1"]}],
  "recommendations": [{"nutrient": "name", "dosage": "amount", "timing": "when", "method": "how"}],
  "improvements": {"timeline": "days", "expectedImpact": "description"}
}`
        }
      ],
      max_tokens: 700,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Nutrient Deficiency Error:', error);
    throw new Error('Failed to detect nutrient deficiency');
  }
}
