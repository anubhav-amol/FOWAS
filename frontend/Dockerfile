FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_API_URL is baked at build time.
# For Railway: set it in Railway's service env vars BEFORE deploy.
# For local Docker: override via docker-compose environment.
ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Railway injects PORT at runtime. Default to 3000 for local Docker.
ENV PORT=3000

# Shell form so $PORT expands at runtime
CMD npx next start -p $PORT
