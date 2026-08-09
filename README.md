# AI Workflow Builder

A full-stack AI workflow automation MVP built with **Next.js, FastAPI, Nhost, Hasura GraphQL, and PostgreSQL**.

The application allows users to load workflows from Hasura, trigger workflow executions, execute multiple step types, and pause execution at an approval gate.

---

## Live Demo

* **Frontend (Vercel):** https://ai-workflow-pvb4.vercel.app/
* **Backend (Railway):** https://ai-workflow-production-cb49.up.railway.app/
* **API Docs:** https://ai-workflow-production-cb49.up.railway.app/docs
* **GraphQL Endpoint:** https://kcgyjzfvtaqklculmxbt.hasura.ap-south-1.nhost.run/v1/graphql

---

## Features

* Organization-scoped workflow storage in PostgreSQL
* GraphQL API powered by Hasura
* Workflow step execution engine in FastAPI
* Step types:

  * `llm_call` (stubbed with delay)
  * `http_request`
  * `approval_gate`
* Live workflow execution result display in the frontend
* Deployment on Vercel and Railway

---

## Tech Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* Uvicorn
* Requests

### Backend Services

* Nhost
* Hasura GraphQL Engine
* PostgreSQL

---

## Project Structure

```text
ai-workflow-builder/
├── app/
│   ├── api/workflows/route.ts
│   └── page.tsx
├── backend/
│   ├── main.py
│   └── requirements.txt
├── ARCHITECTURE.md
├── README.md
└── package.json
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/iqra2243/ai-workflow.git
cd ai-workflow
```

### 2. Frontend

```bash
npm install
npm run dev -- --port 3003
```

Open http://localhost:3003

### 3. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs

---

## API Example

### Trigger Workflow

**POST** `/trigger-workflow`

Request:

```json
{
  "workflow_id": "46d39119-fc1c-4fcc-96a6-0df52cf848a5"
}
```

Example response:

```json
{
  "status": "paused",
  "message": "Workflow paused at approval gate"
}
```

---

## GraphQL Query Example

```graphql
query {
  workflows {
    id
    name
    description
  }
}
```

---

## Current MVP Scope

Implemented:

* Workflow listing
* Workflow execution
* External HTTP request step
* Approval gate pause state
* Live hosted frontend and backend

Planned / future work:

* Real Nhost authentication
* Role-based owner/editor/viewer permissions
* GraphQL subscriptions for live updates
* Webhook and scheduled triggers
* Persistent workflow_runs and step_runs tables
* Quota enforcement

---

## Architecture Notes

See [ARCHITECTURE.md](./ARCHITECTURE.md) for schema reasoning, permission model, and workflow execution details.

---

## Demo Video

Add your Loom / Google Drive / YouTube demo link here before submission.

---

## Author

**Iqra Tahreem**

GitHub: https://github.com/iqra2243
