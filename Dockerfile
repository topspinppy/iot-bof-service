# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#   Build stage
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FROM node:latest AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#   MongoDB initialization stage
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FROM mongo:latest AS mongo-seed

WORKDIR /docker-entrypoint-initdb.d

# Copy mongo-init.js from root folder
COPY ./mongo-init.js .

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#   Run stage
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FROM node:latest AS final

WORKDIR /app

COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main"]
