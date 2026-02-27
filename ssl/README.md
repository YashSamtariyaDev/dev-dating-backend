# SSL certificates for local HTTPS

Place your self‑signed certificates here:
- server.key
- server.crt

## Quick generate self‑signed certs (local only)

Run this from the project root:

```bash
mkdir -p ssl
openssl req -x509 -newkey rsa:2048 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Dev/CN=localhost"
```

Then set HTTPS=true in your .env and restart the app.

## Browser warnings

Self‑signed certs will show a privacy warning in browsers.
Click "Advanced" → "Proceed to localhost (unsafe)" to continue.

## Production

Do NOT use self‑signed certs in production.
Use a reverse proxy (Nginx/Caddy) or cloud provider TLS termination.
