# 🌸 SenpaiStream

![Status](https://img.shields.io/badge/status-active-success.svg) ![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Tech](https://img.shields.io/badge/stack-MERN-9cf.svg)

**SenpaiStream** is a premium, aesthetic anime streaming platform.

![Home Preview](screenshots/home-preview.png)

---

## ℹ️ About

**SenpaiStream** is a modern anime streaming web application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It is designed to provide users with a "Premium" viewing feel through a **Glassmorphism** UI, smooth animations, and zero-ad experience.

Unlike traditional static sites, SenpaiStream scrapes content in real-time, ensuring that users always get the latest episodes as soon as they are available on source providers.

---

## ✨ Key Features

### 🎨 User Experience (UI/UX)
-   **Aesthetic Design**: Modern **Glassmorphism** interface with dynamic blurred backdrops and smooth transitions.
-   **Responsive Layout**: Fully optimized for Desktop, Tablet, and Mobile devices.
-   **Interactive Hero Section**: Cinematic carousel featuring trending anime with "aesthetic blur" ambiance.

### 🚀 Functionality
-   **Real-Time Data**: Content is scraped in real-time from external sources, ensuring zero delay in episode updates.
-   **Advanced Browsing**:
    -   **Global Search**: Fast search bar in Navbar and Browse page.
    -   **Genre Filtering**: Filter by 30+ categories (Action, Romance, Isekai, etc.).
    -   **Smart Sorting**: Sort by Newest, A-Z (Title), or Z-A.
-   **Defensive Pagination**: Robust fallback mechanisms ensure navigation never breaks, even with API hiccups.

### 🛠️ Technical Highlights
-   **Layered Cache Busting**: Prevents stale content issues using both client-side and server-side cache control.
-   **Docker Ready**: Full multi-stage build support for easy containerized deployment.
-   **Admin Panel**: Dedicated dashboard for server management.

---

## 📸 App Previews

### **Browse & Filtering**
Powerful filtering options allow users to find their favorite genre instantly.
![Browse Preview](screenshots/browse-preview.jpg)

---

## 🏛️ System Architecture

```mermaid
graph TD
    User[User] -->|HTTPS| Frontend[React Client]
    Frontend -->|API REST| Backend[Express Server]
    Backend -->|Scrape| Source[Otakudesu/Providers]
    Backend -->|Cache/Store| DB[(MongoDB)]
    Backend -->|Cache/Store| DB[(MongoDB)]
```

### 🔄 User Flow

```mermaid
graph LR
    A[Landing Page] -->|Search / Filter| B[Browse Page]
    A -->|Click Trending| C[Anime Details]
    B -->|Select Anime| C
    C -->|Choose Episode| D[Watch Page]
    D -->|Stream Content| E[Video Player]
```

---

## 🚀 Getting Started

### Prerequisites
-   Node.js v18+
-   MongoDB (Local or Atlas)

---

## ⚙️ Configuration

Before running the app, you need to set up your environment variables.

1.  **Copy the Example File**
    ```bash
    cp backend/.env.example backend/.env
    ```

2.  **Edit `backend/.env`**
    Fill in your details:
    ```env
    PORT=5000
    MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
    JWT_SECRET=super_secret_key_123
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=admin
    ```

> [!TIP]
> **Don't have a Database?**
> Sign up for [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to get a **FREE 512MB Cluster** forever. Perfect for hosting this project! 🍃

---

### Local Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/animeweb.git
    cd animeweb
    ```

2.  **Install Dependencies**
    ```bash
    # Install Root/Backends
    cd backend && npm install
    
    # Install Frontend
    cd ../frontend && npm install
    ```

3.  **Run Development Server**
    ```bash
    # Terminal A (Backend)
    cd backend && npm run dev
    
    # Terminal B (Frontend)
    cd frontend && npm run dev
    ```

---

## 🐳 Self Hosting (Docker)

The application is designed to be easily self-hosted on any VPS or local server.

```bash
# 1. Build the image
docker build -t senpaistream .

# 2. Run container (Daemon/Background)
docker run -d \
  -p 5000:5000 \
  -e MONGO_URI="mongodb://host.docker.internal:27017/animeweb" \
  --name senpaistream \
  --restart always \
  senpaistream
```

Access your instance at `http://your-server-ip:5000`.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

---
*Created with ❤️ by the SenpaiStream Team.*
