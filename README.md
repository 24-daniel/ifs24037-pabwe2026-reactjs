# Aplikasi Lost & Founds — ReactJS (JavaScript) + Delcom Open API

```bash
bun install
bun run dev              # port dari APP_PORT (.env)
bun run build
bun run test             # vitest run
bun run test:coverage    # coverage v8 (threshold 100%)
```

Variabel `.env`: `VITE_DELCOM_BASEURL` / `DELCOM_BASEURL` dan `APP_PORT`.

Cek bentuk request/response pada https://open-api.delcom.org/docs/1.0/api-lost-founds
dan sesuaikan `src/features/lost-founds/api/lostFoundApi.js` bila ada perbedaan.
