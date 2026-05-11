# nyendrak_02240352_DSO101_A1

DSO101 Assignment 1 submission repository.

## Project Overview

This repository contains a full-stack to-do list web application with:

- Frontend: React UI for creating, editing, deleting, and marking tasks as complete
- Backend: Node.js + Express CRUD API
- Database: PostgreSQL for persistent task storage
- Containerization: Dockerfiles for frontend and backend
- Deployment:
1. Part A: Manual Docker image build and push to Docker Hub + deployment to Render from existing images
2. Part B: Automated deployment from GitHub via `render.yaml` Blueprint

## Repository Structure

```text
nyendrak_02240352_DSO101_A1/
	backend/
		Dockerfile
		.dockerignore
		.env.example
		.env.production
		db.js
		package.json
		server.js
	frontend/
		Dockerfile
		.dockerignore
		.env.example
		.env.production
		package.json
		public/
			index.html
		src/
			App.css
			App.js
			index.js
	docs/
		screenshots/
			.gitkeep
	render.yaml
	.gitignore
	README.md
```

## Step 0 (Prerequisite): Build and Run Locally

### 1. Backend environment variables

Create `backend/.env` using `backend/.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=todo_db
```

### 2. Frontend environment variables

Create `frontend/.env` using `frontend/.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4. Run PostgreSQL locally

Make sure PostgreSQL is running and database `todo_db` exists.

### 5. Start backend

```bash
cd backend
npm start
```

Backend runs on: `http://localhost:5000`

### 6. Start frontend

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

### 7. Verify core requirements

- Add task: Works
- Edit task: Works
- Delete task: Works
- Persist after refresh: Works (stored in PostgreSQL)
- `.env` values loaded by frontend/backend: Works
- `.env` is ignored by Git: Confirmed via `.gitignore`

## Part A: Deploy Pre-Built Docker Images

### 1. Build and push backend image (student ID tag)

From repository root:

```bash
cd backend
docker build -t yourdockerhub/be-todo:02240352 .
docker push yourdockerhub/be-todo:02240352
```

### 2. Build and push frontend image (student ID tag)

From repository root:

```bash
cd frontend
docker build -t yourdockerhub/fe-todo:02240352 .
docker push yourdockerhub/fe-todo:02240352
```

### 3. Deploy on Render from existing Docker images

#### Backend Web Service

- Render Dashboard -> New + -> Web Service
- Select: Existing image from Docker Hub
- Image: `yourdockerhub/be-todo:02240352`
- Add env vars:

```env
DB_HOST=<render-db-host>
DB_PORT=<render-db-port>
DB_USER=<render-db-user>
DB_PASSWORD=<render-db-password>
DB_NAME=<render-db-name>
DB_SSL=true
PORT=5000
```

#### Frontend Web Service

- Render Dashboard -> New + -> Web Service
- Select: Existing image from Docker Hub
- Image: `yourdockerhub/fe-todo:02240352`
- Add env vars:

```env
REACT_APP_API_URL=https://be-todo.onrender.com
```

### 4. Part A Evidence (Screenshots)

Add screenshots to `docs/screenshots/` and link below:

- Docker Hub backend image: `docs/screenshots/partA_backend_dockerhub.png`
- Docker Hub frontend image: `docs/screenshots/partA_frontend_dockerhub.png`
- Render backend settings: `docs/screenshots/partA_render_backend_env.png`
- Render frontend settings: `docs/screenshots/partA_render_frontend_env.png`
- Live app running: `docs/screenshots/partA_live_app.png`

Markdown embed example:

```md
![Part A - Live App](docs/screenshots/partA_live_app.png)
```

## Part B: Automated Build and Deployment from GitHub

This repository includes `render.yaml` Blueprint for multi-service deployment.

### 1. `render.yaml` summary

- Creates backend Docker web service (`be-todo`)
- Creates frontend Docker web service (`fe-todo`)
- Creates managed PostgreSQL database (`todo-db`)
- Injects DB credentials into backend automatically with `fromDatabase`
- Enables `autoDeploy: true` so every new Git commit triggers build/deploy

### 2. Deploy with Blueprint

- Push this repository to GitHub
- Render Dashboard -> New + -> Blueprint
- Connect GitHub repository
- Render reads `render.yaml`
- Confirm services and deploy

### 3. Verify auto-deploy

- Push a new commit to GitHub (for example change text in `README.md`)
- Confirm Render starts new build automatically
- Confirm updated version is live

### 4. Part B Evidence (Screenshots)

Add screenshots to `docs/screenshots/` and link below:

- Render Blueprint import: `docs/screenshots/partB_blueprint_import.png`
- Initial deployment success: `docs/screenshots/partB_initial_deploy.png`
- Auto-deploy triggered by commit: `docs/screenshots/partB_autodeploy_trigger.png`
- Updated live deployment: `docs/screenshots/partB_live_update.png`

## Important Notes

- Never commit real `.env` secrets.
- Only commit `.env.example` and `.env.production` templates.
- Student ID tag used for Docker images: `02240352`.

## Relevant References

- Docker docs: https://docs.docker.com/
- Render docs: https://render.com/docs
- Render image deploy: https://render.com/docs/deploying-an-image
- Render environment variables: https://render.com/docs/configure-environment-variables
- Render Blueprint spec: https://render.com/docs/blueprint-spec