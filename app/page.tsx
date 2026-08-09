'use client';

import { useState } from 'react';

const WORKFLOW_ID = '46d39119-fc1c-4fcc-96a6-0df52cf848a5';

type Workflow = {
  id: string;
  name: string;
  description: string;
};

type StepResult = {
  step: string;
  status: string;
  output?: unknown;
  message?: string;
};

type RunResult = {
  id?: string;
  status?: string;
  message?: string;
  steps?: StepResult[];
  error?: string;
};

export default function Home() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);

  const loadWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      const data: { data?: { workflows?: Workflow[] } } =
        await response.json();

      setWorkflows(data.data?.workflows || []);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Unknown error';
      setRunResult({ error: message });
    }
  };

  const runWorkflow = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://ai-workflow-production-cb49.up.railway.app/trigger-workflow',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workflow_id: WORKFLOW_ID,
          }),
        }
      );

      const data: RunResult = await response.json();
      setRunResult(data);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Unknown error';
      setRunResult({ error: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50 text-gray-900'>
      <header className='border-b bg-white shadow-sm'>
        <div className='max-w-5xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>AI Workflow Builder</h1>
            <p className='text-sm text-gray-500'>
              Build, trigger, and monitor AI workflows
            </p>
          </div>

          <div className='flex gap-3'>
            <button
              onClick={loadWorkflows}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition'
            >
              Load Workflows
            </button>

            <button
              onClick={runWorkflow}
              disabled={loading}
              className='bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition'
            >
              {loading ? 'Running...' : 'Run Workflow'}
            </button>
          </div>
        </div>
      </header>

      <section className='max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <p className='text-sm text-gray-500 mb-2'>Total Workflows</p>
          <p className='text-3xl font-bold'>{workflows.length}</p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <p className='text-sm text-gray-500 mb-2'>Execution Status</p>
          <p className='text-3xl font-bold text-yellow-600'>
            {runResult?.status || 'Idle'}
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <p className='text-sm text-gray-500 mb-2'>Backend</p>
          <p className='text-3xl font-bold text-green-600'>Online</p>
        </div>
      </section>

      <section className='max-w-5xl mx-auto px-6 pb-8'>
        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <h2 className='text-xl font-semibold mb-4'>Workflows</h2>

          {workflows.length === 0 ? (
            <p className='text-gray-500'>Click “Load Workflows”.</p>
          ) : (
            <div className='space-y-3'>
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className='border rounded-xl p-4 flex items-start justify-between'
                >
                  <div>
                    <h3 className='font-semibold'>{wf.name}</h3>
                    <p className='text-sm text-gray-500 mt-1'>
                      {wf.description}
                    </p>
                  </div>

                  <span className='text-xs bg-gray-100 px-2 py-1 rounded-full'>
                    {wf.id.slice(0, 8)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className='max-w-5xl mx-auto px-6 pb-12'>
        <div className='bg-white rounded-2xl shadow-sm border p-6'>
          <h2 className='text-xl font-semibold mb-4'>Latest Run</h2>

          {!runResult ? (
            <p className='text-gray-500'>
              Click “Run Workflow” to execute the workflow.
            </p>
          ) : runResult.error ? (
            <p className='text-red-600'>{runResult.error}</p>
          ) : (
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <span className='font-medium'>Status:</span>
                <span className='px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium'>
                  {runResult.status}
                </span>
              </div>

              <p className='text-gray-700'>{runResult.message}</p>

              <div className='space-y-3'>
                {runResult.steps?.map((step, index) => (
                  <div
                    key={index}
                    className='border rounded-xl p-4 bg-gray-50'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <h3 className='font-semibold'>{step.step}</h3>

                      <span
                        className={
                          step.status === 'completed'
                            ? 'text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-medium'
                            : 'text-yellow-800 bg-yellow-100 px-2 py-1 rounded text-xs font-medium'
                        }
                      >
                        {step.status}
                      </span>
                    </div>

                    <pre className='text-sm whitespace-pre-wrap overflow-auto'>
                      {JSON.stringify(
                        step.output ?? step.message,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}