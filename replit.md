# AgriSmart - Smart Agriculture Monitoring System

## Overview
AgriSmart is a comprehensive smart agriculture monitoring system built with React, TypeScript, Vite, and Supabase. It provides real-time monitoring of agricultural conditions using ESP32 sensors, satellite data (NDVI), weather APIs, and AI-powered recommendations.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Animations**: Framer Motion
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM
- **Maps**: Leaflet (CDN)
- **Package Manager**: Bun

## Key Features
- ✅ Real ESP32 Sensor Integration (temperature, humidity, soil moisture, pH, NPK)
- ✅ Satellite NDVI Monitoring (crop health via SentinelHub)
- ✅ Weather API Integration (OpenWeather)
- ✅ AI-Powered Recommendations (English + Telugu)
- ✅ Risk Alerts System
- ✅ Crop Calendar & Season Planner
- ✅ Farm Map Visualization (Leaflet)
- ✅ Voice Assistant (Speech-to-text, English + Telugu)
- ✅ Smart Crop Suggestion Tool
- ✅ Bilingual Support (English & Telugu)

## Project Structure
```
src/
├── components/        # React components
│   ├── dashboard/    # Dashboard-specific components
│   ├── layout/       # Layout components
│   └── ui/           # shadcn/ui components
├── contexts/         # React contexts (Language)
├── hooks/            # Custom React hooks
├── lib/              # Utilities and API clients
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── App.tsx           # Main application component
```

## Environment Variables
The following environment variables are configured in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development
The application runs on port 5000 with Vite's dev server. The workflow is configured to:
- Host: 0.0.0.0 (required for Replit)
- Port: 5000 (required for Replit webview)
- HMR client port: 443 (for proper hot reload)
- Cache directories are ignored to prevent file watch issues

## Supabase Backend
The project includes Supabase Edge Functions in `supabase/functions/`:
- `iot-upload` - Receives ESP32 sensor data
- `satellite-data` - Fetches NDVI from SentinelHub
- `weather-data` - Fetches weather from OpenWeather
- `ai-recommendations` - AI-powered agricultural insights

## ESP32 Integration
The project includes ESP32 firmware (`ESP32_AgriSmart_Firmware.ino`) that:
- Connects to WiFi
- Reads sensor data (or simulates it)
- Sends data to Supabase Edge Functions
- Supports simulation mode for testing without physical sensors

## Deployment
The application is configured for Replit autoscale deployment:
- Build command: `bun run build`
- Run command: `bun run preview`
- Deployment target: Autoscale (stateless)

## Recent Changes (November 24, 2025)
- ✅ Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- ✅ Added HMR configuration for proper hot reload in iframe (clientPort 443)
- ✅ Configured `allowedHosts` for Replit's dynamic preview URLs (.replit.dev, .pike.replit.dev)
- ✅ Configured file watchers to ignore cache directories
- ✅ Fixed duplicate provider wrapping (moved providers to main.tsx only)
- ✅ Added deployment configuration for production builds
- ✅ Installed missing dependency: framer-motion
- ✅ Created API_KEYS_SETUP.md documentation for required credentials

## Notes
- The app uses Bun as the package manager (faster than npm)
- Cache directories are excluded from file watching to prevent "too many open files" errors
- The application supports both English and Telugu languages
- Voice assistant requires HTTPS to work (browser microphone permissions)
