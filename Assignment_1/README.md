# To-Do Application - DSO101 Assignment 1

**Student ID:** 02240352  
**Docker Hub Username:** ny3ndr4k

## 🔗 Links
- **GitHub Repository:** https://github.com/Ny3ndrak/nyendrak_02240352_DSO101_A1
- **Live Frontend:** https://fe-todo-02240352.onrender.com
- **Live Backend:** https://be-todo-02240352.onrender.com

---

## 📋 Table of Contents
- [Technologies Used](#technologies-used)
- [Step 0: Build the To-Do App](#step-0-build-the-to-do-app)
- [Part A: Docker + Render Manual Deploy](#part-a-docker--render-manual-deploy)
- [Part B: Auto Deploy from GitHub](#part-b-auto-deploy-from-github)

---

## 🛠 Technologies Used

**Frontend:** React 18.3.1, Create React App  
**Backend:** Node.js, Express.js 4.19.2  
**Database:** PostgreSQL  
**DevOps:** Docker, Docker Hub, Render, GitHub

---

## Step 0: Build the To-Do App
![to-do](<Screenshots/Screenshot 2026-04-28 020822.png>)

### Application Features
- ✅ Add new tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Persistent storage with PostgreSQL

### Tech Stack Implementation

**Frontend (React):**
- UI for managing tasks
- Connects to backend API
- Uses environment variable for API URL

![Frontend Code](Screenshots/step0-frontend.png)

**Backend (Express + PostgreSQL):**
- REST API endpoints (GET, POST, PUT, DELETE)
- Database connection with auto-initialization
- Environment variables for configuration

![Backend Code](Screenshots/step0-backend.png)

**Database:**
- PostgreSQL with `tasks` table
- Columns: id, title, completed, created_at, updated_at

![Database Schema](Screenshots/step0-database.png)

### Environment Variables Setup

**Backend `.env`:**
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todo_db
DB_SSL=false
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
```

✅ Security: `.env` files excluded from Git via `.gitignore`

![Environment Files](Screenshots/step0-env-files.png)

### Local Testing

Application tested locally before deployment:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: PostgreSQL on localhost:5432

![Local App Working](Screenshots/step0-local-testing.png)

---

## Part A: Docker + Render Manual Deploy

### Step 1: Create Dockerfiles

**Backend Dockerfile** (`Assignment_1/backend/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile** (`Assignment_1/frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

---

### Step 2: Build Docker Images

Used student ID **02240352** as image tag:

```bash
# Build backend
docker build -t ny3ndr4k/be-todo:02240352 -f backend/Dockerfile ./backend

# Build frontend
docker build -t ny3ndr4k/fe-todo:02240352 -f frontend/Dockerfile ./frontend
```

---

### Step 3: Push Images to Docker Hub

```bash
docker login
docker push ny3ndr4k/be-todo:02240352
docker push ny3ndr4k/fe-todo:02240352
```

**Docker Hub Repositories:**
- Backend: https://hub.docker.com/r/ny3ndr4k/be-todo
- Frontend: https://hub.docker.com/r/ny3ndr4k/fe-todo

---

### Step 4: Deploy to Render

#### 4.1 Create PostgreSQL Database
1. Go to Render Dashboard → New + → PostgreSQL
2. Name: `todo-db`
3. Database: `todo_db`
4. User: `todo_user`
5. Click Create Database


#### 4.2 Deploy Backend Service
1. New + → Web Service → "Deploy an existing image from a registry"
2. Image URL: `docker.io/ny3ndr4k/be-todo:02240352`
3. Name: `be-todo-02240352`
4. Environment Variables:
   - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME (from database)
   - DB_SSL=true
   - PORT=5000
5. Click Create Web Service

 ![Backend Deployment](<Screenshots/Screenshot 2026-05-11 171158.png>)

#### 4.3 Deploy Frontend Service
1. New + → Web Service → "Deploy an existing image from a registry"
2. Image URL: `docker.io/ny3ndr4k/fe-todo:02240352`
3. Name: `fe-todo-02240352`
4. Environment Variables:
   - REACT_APP_API_URL=https://be-todo-02240352.onrender.com
5. Click Create Web Service

 ![Frontend Deployment](<Screenshots/Screenshot 2026-05-11 172702.png>)

---

### Step 5: Test Deployed Application

**Live URLs:**
- Frontend: https://fe-todo-02240352.onrender.com
- Backend: https://be-todo-02240352.onrender.com/api/health

**Functionality Tested:**
- ✅ Add tasks
- ✅ Mark as complete
- ✅ Delete tasks
- ✅ Data persists after refresh

![Live Application](<Screenshots/Screenshot 2026-04-28 020822.png>)
---

## Part B: Auto Deploy from GitHub

### Step 1: Create render.yaml

**Location:** `render.yaml` (root directory)

```yaml
services:
  - type: web
    name: be-todo
    env: docker
    dockerfilePath: ./Assignment_1/backend/Dockerfile
    autoDeploy: true
    envVars:
      - key: DB_HOST
        fromDatabase:
          name: todo-db
          property: host
      - key: DB_PORT
        fromDatabase:
          name: todo-db
          property: port
      - key: DB_USER
        fromDatabase:
          name: todo-db
          property: user
      - key: DB_PASSWORD
        fromDatabase:
          name: todo-db
          property: password
      - key: DB_NAME
        fromDatabase:
          name: todo-db
          property: database
      - key: DB_SSL
        value: "true"
      - key: PORT
        value: "5000"

  - type: web
    name: fe-todo
    env: docker
    dockerfilePath: ./Assignment_1/frontend/Dockerfile
    autoDeploy: true
    envVars:
      - key: REACT_APP_API_URL
        value: https://be-todo.onrender.com

databases:
  - name: todo-db
    databaseName: todo_db
    user: todo_user
```

---

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - DSO101 Assignment 1"
git remote add origin https://github.com/Ny3ndrak/nyendrak_02240352_DSO101_A1.git
git push -u origin main
```

---

### Step 3: Deploy Blueprint on Render

1. Render Dashboard → New + → Blueprint
2. Connect GitHub repository
3. Select repository: `nyendrak_02240352_DSO101_A1`
4. Render detects `render.yaml`
5. Click Apply
6. Services auto-deploy

---

### Step 4: Test Auto-Deploy

Made a code change and pushed to GitHub:
```bash
# Changed title in App.js
git add .
git commit -m "Test auto-deploy: Update title"
git push
```

✅ Render automatically detected the push and redeployed services


---

## ✅ Assignment Completion Summary

### Step 0: ✅ Built To-Do Application
- React frontend with CRUD operations
- Express backend with REST API
- PostgreSQL database
- Environment variables configured

### Part A: ✅ Manual Docker Deployment
- Created Dockerfiles for frontend and backend
- Built images with student ID tag (02240352)
- Pushed to Docker Hub (ny3ndr4k/be-todo, ny3ndr4k/fe-todo)
- Deployed manually to Render
- Application working at live URLs

### Part B: ✅ Auto-Deploy Setup
- Created render.yaml blueprint
- Pushed code to GitHub
- Connected repository to Render
- Auto-deploy triggered on git push
- Verified changes deployed automatically

---
