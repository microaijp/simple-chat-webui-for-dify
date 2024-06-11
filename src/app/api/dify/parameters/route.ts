
import { getApplicationInformation } from "@/libs/dify";

// http://localhost:3000/api/dify/parameters

export async function GET(request: Request, { params }) {


    try {
        const applicationInformation = await getApplicationInformation();
        return new Response(JSON.stringify(applicationInformation), {
            status: 200
        });
    }
    catch (e) {
        return new Response(JSON.stringify({
            "status": "error",
            "message": `unknown error ${e.message}`
        }), {
            status: 500
        });
    }
    finally {
    }
}