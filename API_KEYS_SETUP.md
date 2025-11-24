# API Keys Setup Guide

This document explains the API keys and environment variables needed for the AgriSmart application to function fully.

## Required API Keys

The AgriSmart application uses external services that require API credentials. These should be configured in your Supabase project's Edge Functions environment variables.

### 1. Sentinel Hub API (Satellite Data)
**Required for**: NDVI crop health monitoring via satellite imagery

- `SENTINELHUB_CLIENT_ID` - Your Sentinel Hub OAuth client ID
- `SENTINELHUB_CLIENT_SECRET` - Your Sentinel Hub OAuth client secret

**How to get**:
1. Create an account at [Sentinel Hub](https://www.sentinel-hub.com/)
2. Create a new OAuth client in your dashboard
3. Copy the Client ID and Client Secret

**Function**: `supabase/functions/satellite-data/index.ts`

### 2. OpenWeather API (Weather Data)
**Required for**: Real-time weather information (temperature, humidity, wind speed)

- `OPENWEATHER_API_KEY` - Your OpenWeather API key

**How to get**:
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Generate an API key from your account dashboard
3. Free tier includes 1,000 calls/day

**Function**: `supabase/functions/weather-data/index.ts`

### 3. OnSpace AI API (AI Recommendations)
**Required for**: AI-powered agricultural advice and crop recommendations

- `ONSPACE_AI_API_KEY` - Your OnSpace AI API key
- `ONSPACE_AI_BASE_URL` - OnSpace AI service base URL

**Function**: `supabase/functions/ai-recommendations/index.ts`

### 4. Supabase Credentials (IoT Data Storage)
**Required for**: Storing and retrieving ESP32 sensor data

- `SUPABASE_URL` - Your Supabase project URL (auto-configured)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

**Function**: `supabase/functions/iot-upload/index.ts`

## How to Configure

### In Supabase Dashboard:

1. Go to your Supabase project
2. Navigate to **Edge Functions** → **Settings**
3. Add each environment variable with its corresponding value
4. Redeploy your Edge Functions after adding the keys

### For Local Development:

Create a `.env.local` file in the `supabase/functions` directory:

```bash
SENTINELHUB_CLIENT_ID=your_client_id_here
SENTINELHUB_CLIENT_SECRET=your_client_secret_here
OPENWEATHER_API_KEY=your_api_key_here
ONSPACE_AI_API_KEY=your_api_key_here
ONSPACE_AI_BASE_URL=your_base_url_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## What Happens Without API Keys?

The application is designed to handle missing API credentials gracefully:

- **Satellite Monitoring**: Shows error message "SentinelHub credentials missing"
- **Weather Data**: Shows error message indicating weather service is unavailable
- **AI Recommendations**: Shows error message "OnSpace AI credentials not configured"
- **IoT Data**: Will fail to store sensor readings from ESP32 devices

The app will still render and function, but these specific features will show error states instead of data.

## Testing Without External APIs

You can test the application with mock data:

1. The UI components are fully functional
2. The dashboard layout and interactions work
3. Historical data visualization works if you have data in the database
4. Language switching (English/Telugu) works
5. All UI components (forms, dialogs, etc.) are operational

## Production Deployment

Before deploying to production:

1. ✅ Ensure all required API keys are configured in Supabase
2. ✅ Test each Edge Function individually
3. ✅ Verify the ESP32 firmware can connect and send data
4. ✅ Check that CORS headers are properly configured
5. ✅ Monitor API usage to stay within rate limits

## Cost Considerations

- **Sentinel Hub**: Has a free tier with limited requests
- **OpenWeather**: Free tier includes 1,000 calls/day
- **OnSpace AI**: Pricing varies based on usage
- **Supabase**: Free tier available for development

## Support

If you encounter issues with API configuration:

1. Check the Supabase Edge Functions logs for detailed error messages
2. Verify your API keys are valid and not expired
3. Ensure your API accounts have sufficient quota/credits
4. Review the browser console for client-side errors
