# Build BASE
FROM node:20-alpine as BASE

WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn --frozen-lockfile \
    && yarn cache clean

# Build ImageN
FROM node:20-alpine AS BUILD

WORKDIR /app

COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build

# EXPOSE 3000

CMD ["yarn", "start"]

# Build production
# FROM node:20-alpine AS PRODUCTION

# WORKDIR /app

# COPY --from=BUILD /app/public ./public
# COPY --from=BUILD /app/next.config.mjs ./

# # Set mode "standalone" in file "next.config.js"
# COPY --from=BUILD /app/.next/standalone ./
# COPY --from=BUILD /app/.next/static ./.next/static

# CMD ["node", "server.js"]
