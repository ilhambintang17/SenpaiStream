FROM node:20-bullseye

# Install basic dependencies
RUN apt-get update && apt-get install -y curl gnupg lsb-release

# Add Cloudflare GPG Key and Repo
RUN curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/cloudflare-client.list

# Install Cloudflare WARP
RUN apt-get update && apt-get install -y cloudflare-warp

# Create app directory
WORKDIR /usr/src/app

# Copy package.jsons (Root, Backend, Frontend, Admin)
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY admin-panel/package*.json ./admin-panel/

# Install dependencies (Root)
RUN npm install

# Copy source code
COPY . .

# Install Sub-project Dependencies (Explicitly)
RUN npm install --prefix backend
RUN npm install --prefix frontend
RUN npm install --prefix admin-panel

# Build Backend & Frontend
RUN npm run build --prefix backend

RUN npm run build --prefix frontend

# Expose port
EXPOSE 3001

# Copy and setup entrypoint
COPY entrypoint.sh /item/entrypoint.sh
RUN chmod +x entrypoint.sh

# Use entrypoint
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "start"]
