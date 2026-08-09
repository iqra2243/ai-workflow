# Architecture Notes

## Schema reasoning

* `organizations` stores tenant information and usage quota.
* `org_members` maps users to organizations with roles (`owner`, `editor`, `viewer`).
* `workflows` belongs to an organization.
* `workflow_steps` stores ordered workflow nodes with JSON configuration.
* `workflow_runs` represents one execution instance.
* `step_runs` stores execution state for each step.

## Permission model

### Layer 1: Organization isolation

Hasura row permissions are filtered through `org_members` using the caller’s `X-Hasura-User-Id`. This prevents users from reading workflows belonging to another organization.

### Layer 2: Step-level control

Sensitive step types such as `db_write`, `notify`, and webhook triggers should be validated in the backend action handler before execution. Approval actions should also verify the approver’s role before resuming a paused workflow.

## Approval gate

The execution engine processes steps sequentially. When an `approval_gate` step is reached, the run status becomes `paused` and execution stops. A future `approveStep` action can resume execution from the next step.

## Execution engine

The FastAPI endpoint creates a workflow run, executes each step, records results, performs a real external HTTP request, and returns the final run state to the frontend.
