# Docs Are Easy

A free, privacy-first online document toolkit. It helps people prepare, convert, compress and organize documents, especially for Indian competitive-exam applications. Tagline: *Your documents, ready in minutes.*

Files are processed in the browser. Nothing is uploaded.

## Run it on your computer
1. Install Node.js (version 18.17 or newer).
2. Open a terminal in this folder.
3. `npm install`
4. `npm run dev` and open http://localhost:4321

## Build for the web
`npm run build` creates the `dist` folder.

The live address is not decided yet. When it is confirmed, build with it set, for example in PowerShell:

    $env:SITE_URL="https://your-final-address"; npm run build

Until `SITE_URL` is set, the pages do not write canonical or language-alternate links.

## Exam data
`src/data/notifications.json` lists exams and their official websites. No exam requirement is marked as verified. Do not add file sizes or dimensions unless an official notification states them.
