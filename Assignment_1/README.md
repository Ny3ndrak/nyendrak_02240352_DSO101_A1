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

![Dockerfiles](Screenshots/partA-dockerfiles.png)

---

### Step 2: Build Docker Images

Used student ID **02240352** as image tag:

```bash
# Build backend
docker build -t ny3ndr4k/be-todo:02240352 -f backend/Dockerfile ./backend

# Build frontend
docker build -t ny3ndr4k/fe-todo:02240352 -f frontend/Dockerfile ./frontend
```

![Docker Build](Screenshots/partA-docker-build.png)

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

![Docker Hub Images](Screenshots/partA-dockerhub.png)

---

### Step 4: Deploy to Render

#### 4.1 Create PostgreSQL Database
1. Go to Render Dashboard → New + → PostgreSQL
2. Name: `todo-db`
3. Database: `todo_db`
4. User: `todo_user`
5. Click Create Database

![Render Database](Screenshots/partA-render-database.png)

#### 4.2 Deploy Backend Service
1. New + → Web Service → "Deploy an existing image from a registry"
2. Image URL: `docker.io/ny3ndr4k/be-todo:02240352`
3. Name: `be-todo-02240352`
4. Environment Variables:
   - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME (from database)
   - DB_SSL=true
   - PORT=5000
5. Click Create Web Service

![Backend Deployment](Screenshots/partA-backend-deploy.png)

#### 4.3 Deploy Frontend Service
1. New + → Web Service → "Deploy an existing image from a registry"
2. Image URL: `docker.io/ny3ndr4k/fe-todo:02240352`
3. Name: `fe-todo-02240352`
4. Environment Variables:
   - REACT_APP_API_URL=https://be-todo-02240352.onrender.com
5. Click Create Web Service

![Frontend Deployment](Screenshots/partA-frontend-deploy.png)

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

![Live Application](Screenshots/partA-app-working.png)

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

![render.yaml file](Screenshots/partB-render-yaml.png)

---

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - DSO101 Assignment 1"
git remote add origin https://github.com/Ny3ndrak/nyendrak_02240352_DSO101_A1.git
git push -u origin main
```

![GitHub Repository](Screenshots/partB-github-repo.png)

---

### Step 3: Deploy Blueprint on Render

1. Render Dashboard → New + → Blueprint
2. Connect GitHub repository
3. Select repository: `nyendrak_02240352_DSO101_A1`
4. Render detects `render.yaml`
5. Click Apply
6. Services auto-deploy

![Blueprint Deployment](Screenshots/partB-blueprint-deploy.png)

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

![Auto Deploy Triggered](Screenshots/partB-auto-deploy.png)

![Updated App](Screenshots/partB-app-updated.png)

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

## 📸 Screenshots Reference

All screenshots located in `Screenshots/` folder:

**Step 0:**
- step0-frontend.png
- step0-backend.png
- step0-database.png
- step0-env-files.png
- step0-local-testing.png

**Part A:**
- partA-dockerfiles.png
- partA-docker-build.png
- partA-dockerhub.png
- partA-render-database.png
- partA-backend-deploy.png
- partA-frontend-deploy.png
- partA-app-working.png

**Part B:**
- partB-render-yaml.png
- partB-github-repo.png
- partB-blueprint-deploy.png
- partB-auto-deploy.png
- partB-app-updated.png
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

**Screenshot Location:** `screenshots/partB-render-yaml.png`

### Step B2: Connect GitHub Repository

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub account
4. Select repository: `nyendrak_02240352_DSO101_A1`
5. Render automatically detects `render.yaml`
6. Click "Apply"

**Screenshot Location:** `screenshots/partB-github-connection.png`

### Step B3: Test Auto-Deploy

**Test 1: Update Frontend**
```bash
# Make a change to App.js
echo "// Auto-deploy test" >> Assignment_1/frontend/src/App.js

# Commit and push
git add .
git commit -m "Test auto-deploy: Update frontend"
git push origin main
```

**Screenshot Location:** `screenshots/partB-autodeploy-test1.png`

**Test 2: Update Backend**
```bash
# Make a change to server.js
echo "// Auto-deploy test" >> Assignment_1/backend/server.js

# Commit and push
git add .
git commit -m "Test auto-deploy: Update backend"
git push origin main
```

**Screenshot Location:** `screenshots/partB-autodeploy-test2.png`

### Step B4: Verify Auto-Deploy Works

**Expected Behavior:**
- ✅ Push to GitHub triggers automatic rebuild
- ✅ Render detects changes via webhook
- ✅ Docker images rebuilt automatically
- ✅ Services redeployed with new images
- ✅ Application updates live within minutes

**Screenshot Location:** `screenshots/partB-autodeploy-success.png`

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- Git installed

### 1. Clone Repository
```bash
git clone https://github.com/Ny3ndrak/nyendrak_02240352_DSO101_A1.git
cd nyendrak_02240352_DSO101_A1/Assignment_1
```

### 2. Setup PostgreSQL Database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE todo_db;

# Create user (optional)
CREATE USER todo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;

# Exit psql
\q
```

### 3. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_NAME=todo_db
# DB_SSL=false

# Start server
npm start
```

Backend should be running on http://localhost:5000

### 4. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
```

Frontend should open automatically at http://localhost:3001

### 5. Test the Application
1. Open http://localhost:3001 in your browser
2. Add a new task
3. Mark task as complete
4. Delete task
5. Verify data persists (stored in PostgreSQL)

---

## 📚 API Documentation

### Base URL
- **Local:** http://localhost:5000
- **Production:** https://be-todo.onrender.com

### Endpoints

#### Health Check
```
GET /api/health
```
**Response:**
```json
{
  "status": "ok"
}
```

#### Get All Tasks
```
GET /api/tasks
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete assignment",
    "completed": false,
    "created_at": "2026-04-28T10:00:00.000Z",
    "updated_at": "2026-04-28T10:00:00.000Z"
  }
]
```

#### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "New task"
}
```
**Response:** `201 Created`
```json
{
  "id": 2,
  "title": "New task",
  "completed": false,
  "created_at": "2026-04-28T10:05:00.000Z",
  "updated_at": "2026-04-28T10:05:00.000Z"
}
```

#### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated task",
  "completed": true
}
```
**Response:**
```json
{
  "id": 1,
  "title": "Updated task",
  "completed": true,
  "created_at": "2026-04-28T10:00:00.000Z",
  "updated_at": "2026-04-28T10:10:00.000Z"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
```
**Response:**
```json
{
  "message": "Task deleted"
}
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot find module 'react-scripts'"
**Solution:**
```bash
cd frontend
npm install
```

### Issue 2: "Could not find required file: index.html"
**Solution:** Ensure `public` and `src` folders exist with required files.

### Issue 3: PostgreSQL Connection Error
**Solution:**
- Verify PostgreSQL is running: `psql -U postgres`
- Check `.env` credentials match your PostgreSQL setup
- Ensure `todo_db` database exists

### Issue 4: Docker Build Fails
**Solution:**
- Ensure Docker Desktop is running
- Check Dockerfile syntax
- Verify you're in correct directory

### Issue 5: Render Deployment Fails
**Solution:**
- Check Render logs for specific error
- Verify environment variables are set correctly
- Ensure Docker images are public on Docker Hub

### Issue 6: Auto-deploy Not Triggering
**Solution:**
- Verify GitHub is connected to Render
- Check webhook is active in GitHub settings
- Ensure `render.yaml` is in repository root

---

## 📸 Screenshots

All screenshots are located in the `screenshots/` directory:

### Step 0: Building the App
- `step0-frontend-code.png` - React frontend source code
- `step0-backend-code.png` - Express backend source code
- `step0-database-schema.png` - PostgreSQL table structure
- `step0-env-files.png` - Environment configuration files

### Part A: Docker + Manual Deployment
- `partA-backend-dockerfile.png` - Backend Dockerfile
- `partA-frontend-dockerfile.png` - Frontend Dockerfile
- `partA-docker-build.png` - Docker build output
- `partA-docker-push.png` - Docker push output
- `partA-dockerhub-repos.png` - Docker Hub repositories
- `partA-render-backend-deploy.png` - Render backend deployment
- `partA-render-frontend-deploy.png` - Render frontend deployment
- `partA-render-database.png` - Render PostgreSQL setup
- `partA-live-app.png` - Live application interface

### Part B: Auto-Deploy
- `partB-render-yaml.png` - render.yaml configuration
- `partB-github-connection.png` - GitHub integration
- `partB-autodeploy-test1.png` - First auto-deploy test
- `partB-autodeploy-test2.png` - Second auto-deploy test
- `partB-autodeploy-success.png` - Successful auto-deploy

### Application Features
- `app-add-task.png` - Adding a task
- `app-complete-task.png` - Marking task complete
- `app-delete-task.png` - Deleting a task
- `app-task-list.png` - Task list view

---

## ✅ Assignment Completion Checklist

### Step 0: Build To-Do App
- [x] Frontend with add, edit, delete functionality
- [x] Backend API (Node.js/Express)
- [x] Database (PostgreSQL)
- [x] .env files for credentials
- [x] Credentials NOT committed to GitHub

### Part A: Docker + Render (Manual)
- [x] Dockerfile for backend
- [x] Dockerfile for frontend
- [x] Build backend image with tag `02240352`
- [x] Build frontend image with tag `02240352`
- [x] Push backend to Docker Hub
- [x] Push frontend to Docker Hub
- [x] Manual deployment to Render

### Part B: Auto Deploy
- [x] render.yaml file created
- [x] GitHub repo connected to Render
- [x] Auto-deploy tested and working
- [x] Documentation with screenshots

---

## 👨‍💻 Author

**Student ID:** 02240352  
**Name:** Nyendrak  
**Course:** DSO101 - Assignment 1  
**Date:** April 28, 2026

---

## 📄 License

This project is created for educational purposes as part of DSO101 coursework.
