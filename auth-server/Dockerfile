FROM node:18

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# ✅ dotenv/config preload
CMD ["node", "-r", "dotenv/config", "dist/main"]