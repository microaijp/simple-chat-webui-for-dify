

const DIFY_APP_API_KEY = process.env.DIFY_APP_API_KEY;
const DIFY_APP_API_BASE_URL = process.env.DIFY_APP_API_BASE_URL;

export const getApplicationInformation = async () => {
    const response = await fetch(`${DIFY_APP_API_BASE_URL}/v1/parameters?user=abc-123`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${DIFY_APP_API_KEY}`
        },
        cache: 'no-store'
    });

    const json = await response.json();
    return json;
}

export const getApplicationMetaInformation = async () => {
    const response = await fetch(`${DIFY_APP_API_BASE_URL}/v1/meta?user=abc-123`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${DIFY_APP_API_KEY}`
        },
        cache: 'no-store'
    });

    const json = await response.json();
    return json;
}
