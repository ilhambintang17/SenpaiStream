# Stage 1: Build Backend
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 2: Build Frontend (User)
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Output to /app/frontend/dist
RUN npm run build

# Stage 3: Build Admin Panel
FROM node:20-alpine AS admin-build
WORKDIR /app/admin-panel
COPY admin-panel/package*.json ./
RUN npm install
COPY admin-panel/ ./
# Output to /app/admin-panel/dist
RUN npm run build

# Stage 4: Production Runtime
FROM node:20-alpine
WORKDIR /app

# Copy Backend Build
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package*.json ./
# Install ONLY production dependencies for backend
RUN npm install --production

# Copy Built Frontends to where Express expects them
# Express looks in ../frontend/dist relative to dist/index.js -> /app/frontend/dist
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
COPY --from=admin-build /app/admin-panel/dist ./admin-panel/dist

# Expose Port
ENV PORT=5000
EXPOSE 5000

# Start Server
CMD ["node", "dist/index.js"]
