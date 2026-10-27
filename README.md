# HandSight-Frontend

A single-page Next.js app for a handwriting-analysis demo. You upload a
handwriting sample, the app sends it to a backend service, and the response
comes back as trait scores with slant-angle and pen-pressure values, rendered
as animated bars.

Live demo: https://hand-sight-frontend.vercel.app/

## How it works

`app/page.tsx` handles the whole flow. Pick an image (JPG or PNG) and the page
shows a preview with a scan animation while the request is in flight. On
analyze, the file goes as multipart form data to the `/analyze` endpoint of
`https://handsight-backend.onrender.com`, and the JSON response is rendered as
trait progress bars plus the slant and pressure numbers from
`analysis_reasoning`. The analysis runs on that backend; this repo is only the
UI. The backend runs on Render's free tier, so the first request after an idle
period can fail while the service wakes up.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- framer-motion for the upload scan and result animations
- axios for the API call, lucide-react for icons

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Analysis needs the backend service to be awake.
