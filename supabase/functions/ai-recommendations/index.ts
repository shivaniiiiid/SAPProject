import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });

// New SmartAgriAI handler
async function handleSmartAgriAI(body: any) {
  const { n, p, k, ph, moisture, temperature, humidity, ndvi, language = 'en' } = body;

  const languageNames: Record<string, string> = {
    en: 'English',
    te: 'Telugu',
  };

  const languageName = languageNames[language] || 'English';
  const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
  const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

  if (!apiKey || !baseUrl) {
    throw new Error('OnSpace AI credentials not configured');
  }

  const prompt = `You are an expert agricultural consultant helping farmers with soil and crop management.

Current Farm Data:
- Nitrogen (N): ${n} ppm
- Phosphorus (P): ${p} ppm
- Potassium (K): ${k} ppm
- Soil pH: ${ph}
- Soil Moisture: ${moisture}%
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- NDVI (Crop Health): ${ndvi}

IMPORTANT: Respond ONLY in ${languageName} language using simple, farmer-friendly words.

Provide your response in this exact JSON format:
{
  "fertilizer_plan": "Simple step-by-step fertilizer recommendations with quantities",
  "soil_advice": "Analysis of N, P, K, and pH levels with clear status",
  "irrigation": "Water management advice - how much, when, and how often",
  "pest_warning": "Risk level (low/medium/high) with preventive measures",
  "crop_health_status": "healthy / improving / stress - based on NDVI",
  "two_day_action_plan": ["Action 1", "Action 2", "Action 3"]
}

Use color-coded status indicators:
- Good/Healthy → Green status
- Needs attention → Yellow status
- Problem → Red status

Keep language simple and actionable for farmers.`;

  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are an expert agricultural consultant. Always respond in ${languageName}.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    throw new Error(`AI API error: ${aiResponse.status} - ${errorText}`);
  }

  const data = await aiResponse.json();
  const content = data.choices[0].message.content;
  
  // Parse the JSON response
  const recommendations = JSON.parse(content);

  return new Response(
    JSON.stringify(recommendations),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
  }

  try {
    const body = await req.json();
    
    // Check if this is the new SmartAgriAI request format
    if (body.n !== undefined || body.language !== undefined) {
      return handleSmartAgriAI(body);
    }
    
    // Legacy format for old AIRecommendations component
    const { cropType, soilType, area, season } = body;
    
    if (!cropType || !soilType) {
      throw new Error('Crop type and soil type are required');
    }

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');
    
    if (!apiKey || !baseUrl) {
      throw new Error('OnSpace AI credentials not configured');
    }

    const prompt = `You are an expert agricultural consultant. Provide detailed fertilizer and pest management recommendations for the following scenario:

Crop Type: ${cropType}
Soil Type: ${soilType}
Area: ${area || 'Not specified'} hectares
Season: ${season || 'Current season'}

Please provide a comprehensive analysis in JSON format with the following structure:
{
  "fertilizerRecommendations": {
    "nitrogen": { "amount": "kg/hectare", "timing": "when to apply", "type": "recommended fertilizer type" },
    "phosphorus": { "amount": "kg/hectare", "timing": "when to apply", "type": "recommended fertilizer type" },
    "potassium": { "amount": "kg/hectare", "timing": "when to apply", "type": "recommended fertilizer type" },
    "micronutrients": ["list of recommended micronutrients with amounts"]
  },
  "pestManagement": {
    "commonPests": ["list of common pests for this crop"],
    "preventiveMeasures": ["list of preventive measures"],
    "organicSolutions": ["list of organic pest control methods"],
    "chemicalOptions": ["list of chemical options if needed"],
    "monitoringTips": ["list of monitoring recommendations"]
  },
  "irrigationAdvice": {
    "frequency": "irrigation frequency recommendation",
    "amount": "water amount recommendation",
    "method": "recommended irrigation method",
    "criticalStages": ["growth stages requiring more water"]
  },
  "seasonalTips": ["list of 5-7 actionable seasonal farming tips"],
  "yieldPrediction": {
    "expectedYield": "estimated yield range",
    "factors": ["key factors affecting yield"]
  }
}

Provide specific, actionable recommendations based on agricultural best practices.`;

    const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

// New SmartAgriAI handler
async function handleSmartAgriAI(body: any) {
  const { n, p, k, ph, moisture, temperature, humidity, ndvi, language = 'en' } = body;

  const languageNames: Record<string, string> = {
    en: 'English',
    te: 'Telugu',
  };

  const languageName = languageNames[language] || 'English';
  const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
  const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

  if (!apiKey || !baseUrl) {
    throw new Error('OnSpace AI credentials not configured');
  }

  const prompt = `You are an expert agricultural consultant helping farmers with soil and crop management.

Current Farm Data:
- Nitrogen (N): ${n} ppm
- Phosphorus (P): ${p} ppm
- Potassium (K): ${k} ppm
- Soil pH: ${ph}
- Soil Moisture: ${moisture}%
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- NDVI (Crop Health): ${ndvi}

IMPORTANT: Respond ONLY in ${languageName} language using simple, farmer-friendly words.

Provide your response in this exact JSON format:
{
  "fertilizer_plan": "Simple step-by-step fertilizer recommendations with quantities",
  "soil_advice": "Analysis of N, P, K, and pH levels with clear status",
  "irrigation": "Water management advice - how much, when, and how often",
  "pest_warning": "Risk level (low/medium/high) with preventive measures",
  "crop_health_status": "healthy / improving / stress - based on NDVI",
  "two_day_action_plan": ["Action 1", "Action 2", "Action 3"]
}

Use color-coded status indicators:
- Good/Healthy → Green status
- Needs attention → Yellow status
- Problem → Red status

Keep language simple and actionable for farmers.`;

  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are an expert agricultural consultant. Always respond in ${languageName}.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    throw new Error(`AI API error: ${aiResponse.status} - ${errorText}`);
  }

  const data = await aiResponse.json();
  const content = data.choices[0].message.content;
  
  // Parse the JSON response
  const recommendations = JSON.parse(content);

  return new Response(
    JSON.stringify(recommendations),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`OnSpace AI error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0].message.content;

    // Try to parse JSON from response
    let recommendations;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, responseText];
      recommendations = JSON.parse(jsonMatch[1]);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return raw response if JSON parsing fails
      recommendations = {
        rawResponse: responseText,
        error: 'Response could not be parsed as structured data',
      };
    }

    return new Response(
      JSON.stringify(recommendations),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('AI recommendations error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// New SmartAgriAI handler
async function handleSmartAgriAI(body: any) {
  const { n, p, k, ph, moisture, temperature, humidity, ndvi, language = 'en' } = body;

  const languageNames: Record<string, string> = {
    en: 'English',
    te: 'Telugu',
  };

  const languageName = languageNames[language] || 'English';
  const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
  const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

  if (!apiKey || !baseUrl) {
    throw new Error('OnSpace AI credentials not configured');
  }

  const prompt = `You are an expert agricultural consultant helping farmers with soil and crop management.

Current Farm Data:
- Nitrogen (N): ${n} ppm
- Phosphorus (P): ${p} ppm
- Potassium (K): ${k} ppm
- Soil pH: ${ph}
- Soil Moisture: ${moisture}%
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- NDVI (Crop Health): ${ndvi}

IMPORTANT: Respond ONLY in ${languageName} language using simple, farmer-friendly words.

Provide your response in this exact JSON format:
{
  "fertilizer_plan": "Simple step-by-step fertilizer recommendations with quantities",
  "soil_advice": "Analysis of N, P, K, and pH levels with clear status",
  "irrigation": "Water management advice - how much, when, and how often",
  "pest_warning": "Risk level (low/medium/high) with preventive measures",
  "crop_health_status": "healthy / improving / stress - based on NDVI",
  "two_day_action_plan": ["Action 1", "Action 2", "Action 3"]
}

Use color-coded status indicators:
- Good/Healthy → Green status
- Needs attention → Yellow status
- Problem → Red status

Keep language simple and actionable for farmers.`;

  const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: `You are an expert agricultural consultant. Always respond in ${languageName}.` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!aiResponse.ok) {
    const errorText = await aiResponse.text();
    throw new Error(`AI API error: ${aiResponse.status} - ${errorText}`);
  }

  const data = await aiResponse.json();
  const content = data.choices[0].message.content;
  
  // Parse the JSON response
  const recommendations = JSON.parse(content);

  return new Response(
    JSON.stringify(recommendations),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
