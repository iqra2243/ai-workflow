from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from uuid import uuid4
import time

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:3003',
        'https://ai-workflow-pvb4.vercel.app',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class TriggerRequest(BaseModel):
    workflow_id: str


@app.post('/trigger-workflow')
async def trigger_workflow(payload: TriggerRequest):
    workflow_run_id = str(uuid4())

    results = []

    # Step 1: llm_call (stubbed)
    results.append({
        'step': 'Classify Ticket',
        'status': 'completed',
        'output': 'normal'
    })

    time.sleep(1)

    # Step 2: http_request
    r = requests.get('https://jsonplaceholder.typicode.com/todos/1')

    results.append({
        'step': 'Call API',
        'status': 'completed',
        'output': r.json()
    })

    time.sleep(1)

    # Step 3: approval_gate
    results.append({
        'step': 'Manager Approval',
        'status': 'paused',
        'message': 'Awaiting owner approval'
    })

    return {
        'id': workflow_run_id,
        'status': 'paused',
        'message': 'Workflow paused at approval gate',
        'steps': results
    }