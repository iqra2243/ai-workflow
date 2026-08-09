export async function GET() {
  const response = await fetch(
    'https://kcgyjzfvtaqklculmxbt.hasura.ap-south-1.nhost.run/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-role': 'public',
        'x-hasura-user-id':
          '22222222-2222-2222-2222-222222222222',
      },
      body: JSON.stringify({
        query: `
          query {
            workflows {
              id
              name
              description
            }
          }
        `,
      }),
    }
  );

  const data = await response.json();

  return Response.json(data);
}