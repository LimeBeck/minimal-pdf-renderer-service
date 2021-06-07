# Simple Stupid Pdf Renderer Service

Render PDF with page size from CSS params using Puppeteer. Looks like you press `print` button in your browser

## How to run

* Use Dockerfile: `docker run -p 4000:4000 limebeck/minimal-pdf-renderer`
* Run with NodeJs: `npm run dev` (alias for `npm run build && npm start`)

## Variables

- **PORT** - listening port, default: `4000`

## How to use

Pass url query parameter to `render` endoint
* `curl http://localhost:4000/api/render?url=https://google.com`