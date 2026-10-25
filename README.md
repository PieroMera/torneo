# Torneo frontend

Frontend React + Vite para la app de torneos. Este repositorio contiene solo la aplicación web; la API Spring Boot está en [`PieroMera/torneo1`](https://github.com/PieroMera/torneo1).

## Desarrollo local

```sh
npm install
npm run dev
```

Vite reenvía `/api` a `http://localhost:8080`. Para apuntar el frontend a otro backend, define `VITE_API_URL` con el origen del servicio (sin `/api`), por ejemplo `https://torneo-backend.onrender.com`.

## Vercel

Importa este repositorio y usa los valores por defecto de Vite (`npm run build`, carpeta `dist`). En Environment Variables configura `VITE_API_URL` con la URL base del backend de Render, sin `/api`. Configura `CORS_ALLOWED_ORIGINS` en Render con el dominio del frontend de Vercel.
