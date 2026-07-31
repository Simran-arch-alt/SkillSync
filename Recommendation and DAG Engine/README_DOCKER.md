Running the curriculum API in Docker

Quick steps (from project root):

1. Build the image:

```bash
docker build -t curriculum-api .
```

2. Run with Docker:

```bash
docker run -p 8000:8000 --name curriculum-api \
  -e YOUTUBE_API_KEY="your_key_if_any" \
  -e GOOGLE_BOOKS_API_KEY="your_key_if_any" \
  -v "$(pwd)":/app \
  curriculum-api
```

or using docker-compose (recommended while developing):

```bash
# optionally export keys in your shell
export YOUTUBE_API_KEY=your_key
export GOOGLE_BOOKS_API_KEY=your_key

docker-compose up --build
```

3. Test the endpoints:

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/curriculum
curl "http://127.0.0.1:8000/curriculum?enrich=true"
```

Notes:
- The container mounts the project directory so you can edit files locally and see changes.
- To enable ESCO/O*NET merging, place `esco.json` and/or `onet.json` in the project root; the API will read them automatically.
- Provide API keys for YouTube/Books via environment variables to enable remote enrichment.
