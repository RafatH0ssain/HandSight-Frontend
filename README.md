# HandSight-Frontend

A single-page Next.js demo app for a handwriting-analysis exercise. You upload a
handwriting sample, the app sends it to a backend service, and the response
comes back as trait scores with slant-angle and pen-pressure values, rendered
as animated bars.

Live demo: https://hand-sight-frontend.vercel.app/

## How it works

`app/page.tsx` handles the whole flow. Pick an image (JPG or PNG) and the page
shows a preview with a scan animation while the request is in flight. On
analyze, the file goes as multipart form data to the `/analyze` endpoint of the
backend, and the JSON response is rendered as trait progress bars plus the
slant and pressure numbers from `analysis_reasoning`. Each trait is a 0-100%
score named by the backend; the numbers are outputs of an experimental
analysis endpoint and are for demonstration only. The analysis runs on the
backend; this repo is only the UI. That service runs on Render's free tier, so
the first request after an idle period can fail while it wakes up.

## Backend

Analysis runs on a separate service: https://handsight-backend.onrender.com
(its source is not public). To use your own instance, set
`NEXT_PUBLIC_API_URL` as described below.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- framer-motion for the upload scan and result animations
- axios for the API call, lucide-react for icons

## Run locally

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Then open http://localhost:3000. `NEXT_PUBLIC_API_URL` sets the analysis
backend base URL and defaults to `https://handsight-backend.onrender.com` when
unset. Analysis needs that service to be awake.
