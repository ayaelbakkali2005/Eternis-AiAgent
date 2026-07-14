# 🛠️ SETUP.md - Project Setup Guide

> Complete instructions to clone, configure, run, test, and deploy **Eternis AI-Driven ERP**.

---

## 📋 Prerequisites

Ensure you have the following installed before proceeding:

| Tool              | Minimum Version | Installation Link                                          |
|-------------------|-----------------|------------------------------------------------------------|
| Git               | `2.30+`         | https://git-scm.com/downloads                              |
| Python            | `3.10+`         | https://www.python.org/downloads/                          |
| Node.js           | `18.0+`         | https://nodejs.org/                                        |
| PostgreSQL        | `14+`           | https://www.postgresql.org/download/                       |
| Docker (Optional) | `20.10+`        | https://docs.docker.com/get-docker/                        |

💡 *Tip: We highly recommend using `uv` for lightning-fast Python package management and virtual environments.*

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/ayaelbakkali2005/eternis-frontend.git](https://github.com/ayaelbakkali2005/eternis-frontend.git)
   cd eternis-frontend

2. **Install dependencies**
   # Example for Node.js:
   npm install
   # or yarn install / pnpm install

   # Example for Python:
   pip install -r requirements.txt
   # or uv sync / poetry install

3. **Initialize submodules(if any)**
   git submodule update --init --recursive

--

## Configuration 

1. **Create environment file**
    cp .env.example .env

2. **Fill in required variables**
      # Server
   PORT=3000
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

   # Secrets & Keys
   JWT_SECRET=your-super-secret-key
   API_KEY=your-third-party-api-key

3. **Database/Storage Setup (if applicable)**
   # Run migrations
   npm run db:migrate
   # Seed initial data
   npm run db:seed

--

# Running The Project :

  # Start development server with hot-reload
  npm run dev
  
  # Compile/optimize for production
  npm run build
  
  # Run production server
  npm run start
  
  # Check code style & fix issues
  npm run lint

  # Auto-format codebase
  npm run format
  