// app/api/judge/route.ts

const API_URL = 'https://philosophist.vercel.app/api/v1/judge';

export async function POST(request: Request) {
    const body = await request.json();
    const basicAuth = btoa(`${process.env.BASIC_AUTH_USERNAME}:${process.env.BASIC_AUTH_PASSWORD}`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${basicAuth}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('API call failed:', error);
        return Response.json(
            { error: 'APIコールに失敗しました' },
            { status: 500 }
        );
    }
}
