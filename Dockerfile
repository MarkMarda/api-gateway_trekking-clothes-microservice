ARG NODE_VERSION=20.14-alpine3.19 

# Install dependencies only when needed
FROM node:${NODE_VERSION} AS deps
# https://github.com/nodejs/docker-node?tab=readme-ov-file to understand why gcompat might be needed.
RUN apk add --no-cache gcompat 
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Build the app with cache dependencies
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM node:${NODE_VERSION} AS runner
# Set working directory
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main.js" ]