import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Extract data from ESP32
    const {
      n_value,
      p_value,
      k_value,
      soil_ph,
      soil_moisture,
      temperature,
      humidity,
      latitude,
      longitude,
      ndvi,
    } = body;

    // Validate at least some data is present
    if (
      n_value === undefined &&
      p_value === undefined &&
      k_value === undefined &&
      soil_ph === undefined &&
      soil_moisture === undefined &&
      temperature === undefined &&
      humidity === undefined
    ) {
      return new Response(
        JSON.stringify({ error: 'No valid sensor data provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert data (only fields that are provided)
    const insertData: any = {};
    if (n_value !== undefined) insertData.n_value = n_value;
    if (p_value !== undefined) insertData.p_value = p_value;
    if (k_value !== undefined) insertData.k_value = k_value;
    if (soil_ph !== undefined) insertData.soil_ph = soil_ph;
    if (soil_moisture !== undefined) insertData.soil_moisture = soil_moisture;
    if (temperature !== undefined) insertData.temperature = temperature;
    if (humidity !== undefined) insertData.humidity = humidity;
    if (latitude !== undefined) insertData.latitude = latitude;
    if (longitude !== undefined) insertData.longitude = longitude;
    if (ndvi !== undefined) insertData.ndvi = ndvi;

    const { data, error } = await supabase
      .from('iot_readings')
      .insert([insertData])
      .select();

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('✅ IoT data uploaded successfully:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data uploaded successfully',
        id: data[0].id,
        timestamp: data[0].created_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('IoT upload error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
