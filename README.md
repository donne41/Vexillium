# Vexillium

![GitHub stars](https://img.shields.io/github/stars/donne41/Vexillium?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/donne41/Vexillium?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/donne41/Vexillium?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/donne41/Vexillium?style=for-the-badge&logo=github)

## 📑 Table of Contents

- [Description](#description)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Key Dependencies](#key-dependencies)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development Setup](#development-setup)
- [Contributors](#contributors)
- [Contributing](#contributing)

## 📝 Description

Vexillium — a backend api built with Docker, Express.js, JavaScript, MySQL, Vite.

## 📸 Screenshots

![homescreen](https://raw.githubusercontent.com/donne41/Vexillium/main/frontend/src/assets/images/home_screenshot.png)

![flagquiz](https://raw.githubusercontent.com/donne41/Vexillium/main/frontend/src/assets/images/flagquiz_screenshot.png)

## 🛠️ Tech Stack

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Notable libraries:** Socket.IO

## 🏗️ Architecture

A high-level view of how the main pieces fit together:

```mermaid
flowchart TD
    User["👤 User / Browser"]
    API["⚙️ Express API"]
    User --> API
    DB[("🗄️ MySQL")]
    API --> DB
    EXT0["🔌 Realtime"]
    API --> EXT0
```

## ⚡ Quick Start

```bash

# 1. Clone the repository
git clone https://github.com/donne41/Vexillium.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Start docker
docker compose up -up in backend

# 5. Start backend server
node app.js
```

## 📦 Key Dependencies

```
bcryptjs: ^3.0.3
cors: ^2.8.6
dotenv: ^18.0.7
express: ^5.3.0
express-rate-limit: ^8.7.1
express-session: ^1.19.0
mysql2: ^3.24.6
socket.io: ^4.8.4
```

## 🛠️ Development Setup

### Node.js / JavaScript
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` (or `yarn` / `pnpm install` / `bun install`)
3. Start the dev server: see the **Quick Start** above

## 👥 Contributors

Thanks to everyone who has contributed to this project:

<p align="left">
<a href="https://github.com/donne41" title="donne41"><img src="https://avatars.githubusercontent.com/u/229072997?v=4&s=64" width="64" height="64" alt="donne41" style="border-radius:50%" /></a>
<a href="https://github.com/Martin-E-Karlsson" title="Martin-E-Karlsson"><img src="https://avatars.githubusercontent.com/u/45791249?v=4&s=64" width="64" height="64" alt="Martin-E-Karlsson" style="border-radius:50%" /></a>
<a href="https://github.com/Ericthilen" title="Ericthilen"><img src="https://avatars.githubusercontent.com/u/214992469?v=4&s=64" width="64" height="64" alt="Ericthilen" style="border-radius:50%" /></a>
<a href="https://github.com/JohanHiths" title="JohanHiths"><img src="https://avatars.githubusercontent.com/u/228579288?v=4&s=64" width="64" height="64" alt="JohanHiths" style="border-radius:50%" /></a>
</p>

[See the full list of contributors →](https://github.com/donne41/Vexillium/graphs/contributors)
