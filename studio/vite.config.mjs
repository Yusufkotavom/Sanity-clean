import { defineConfig } from "vite";

const allowedHosts = (
  process.env.SANITY_STUDIO_ALLOWED_HOSTS ||
  "devk.my.id,3333.devk.my.id,.devk.my.id,localhost,127.0.0.1"
)
  .split(",")
  .map((entry) => entry.trim())
  .filter(Boolean);

export default defineConfig({
  server: {
    allowedHosts,
  },
});
