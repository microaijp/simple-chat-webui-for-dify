import { Readable } from 'stream';
import { ReadableStream } from 'stream/web';

export async function POST(request) {
    const req = await request.json();

    const DIFY_APP_API_BASE_URL = `${process.env.DIFY_APP_API_BASE_URL}/chat-messages`;
    const DIFY_APP_API_KEY = process.env.DIFY_APP_API_KEY;

    const requestData = req;

    const response = await fetch(DIFY_APP_API_BASE_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DIFY_APP_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (!response.body) {
        return new Response(JSON.stringify({ error: 'No response body' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async function* streamToAsyncIterable(stream) {
        const reader = stream.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                yield value;
            }
        } finally {
            reader.releaseLock();
        }
    }

    const asyncIterable = streamToAsyncIterable(response.body);
    const readableStream = Readable.from(asyncIterable);

    const webReadableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of readableStream) {
                controller.enqueue(chunk);
            }
            controller.close();
        }
    });

    return new Response(webReadableStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}
