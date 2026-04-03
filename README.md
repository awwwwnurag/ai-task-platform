# AI Task Processing Platform

A full-stack, scalable AI Task Processing Platform utilizing an asynchronous worker queue. 
Constructed with React (Vite), Node.js (Express), MongoDB, Redis, and Python.

## Architecture

* **React Frontend**: Beautiful glassmorphic UI parsing JWT contexts and actively polling backend statuses seamlessly.
* **Express Backend**: Secure Node service authenticating requests and managing stateful operations natively using `mongoose` and a generic `redisClient` List.
* **Python Worker**: Independent microservice monitoring Redis channels dynamically via `BLPOP` mechanisms to execute string manipulation jobs effortlessly.
* **Datastores**: MongoDB persistent storage tracking detailed operational logs coupled with a high-speed volatile local Redis queue.

## Local Setup

### Using Docker Compose (Recommended)
This requires Docker Desktop natively installed and functioning.

1. Clone and navigate to the project root.
2. Start the unified stack in detached mode:
   ```bash
   docker-compose up --build -d
   ```
3. Open your browser and navigate to `http://localhost:8080`.
4. Register a new user credential, head over to the dashboard, and spawn real-time tasks. Watch the Python worker process payloads flawlessly in isolated namespaces!

### Manual Setup (Without Docker)

You will need an active native MongoDB running locally on `27017` and a Redis cache operating on `6379`.

**1. Backend Terminal:**
```bash
cd ai-task-backend
npm install
npm run dev
```

**2. Python Worker Terminal:**
```bash
cd ai-task-backend/worker
pip install -r requirements.txt
python worker.py
```

**3. Frontend Terminal:**
```bash
cd ai-task-frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

## Production Kubernetes Deployment

The `/k8s` directory contains comprehensive `kubectl` configuration manifests mapping logic discretely against namespaces, services, configMaps, secrets, and horizontally scalable deployment policies.

1. Ensure you possess a valid standard Kubernetes Cluster.
2. Apply the recursive deployment mechanisms natively:
   ```bash
   kubectl apply -f k8s/
   ```
3. Nginx Ingress will expose the deployment endpoints matching internal services seamlessly. 
4. Optional comprehensive GitOps continuous synchronization workflows exist underneath `.github/workflows/ci.yaml`.
