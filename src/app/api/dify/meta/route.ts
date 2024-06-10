
import { getApplicationMetaInformation } from "@/libs/dify";

// http://localhost:3000/api/dify/application/meta/information
export async function GET(request: Request, { params }) {


    try {

        const applicationMetaInformation = await getApplicationMetaInformation();
        return new Response(JSON.stringify(applicationMetaInformation), {
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