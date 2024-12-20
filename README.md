# Cypress SenNet Service UI

## Getting Started

```bash
npm i .
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Docker 
```
docker build -t cypress-portal-service .
docker run -p 3001:3001 cypress-portal-service
```