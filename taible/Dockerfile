# Local development image for the Taible Next.js app.
FROM node:22-slim

# pnpm via corepack (version comes from packageManager / .mise.toml → pnpm 10)
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Install deps first for better layer caching. Lockfile is regenerated on
# first build because the stack changed (Vite → Next), so no --frozen-lockfile.
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
