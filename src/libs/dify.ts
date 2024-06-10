

const DIFY_APP_API_KEY = process.env.DIFY_APP_API_KEY;
const DIFY_APP_API_BASE_URL = process.env.DIFY_APP_API_BASE_URL;

export const getApplicationInformation = async () => {
    const response = await fetch(`${DIFY_APP_API_BASE_URL}/parameters?user=abc-123`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${DIFY_APP_API_KEY}`
        }
    });

    const json = await response.json();
    return json;
}

export const getApplicationMetaInformation = async () => {
    const response = await fetch(`${DIFY_APP_API_BASE_URL}/meta?user=abc-123`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${DIFY_APP_API_KEY}`
        }
    });

    const json = await response.json();
    return json;
}
