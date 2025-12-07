import { fetchTraits } from "@/app/lib/segment";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function GET() {
  const cookieStore = await cookies();
  const anonymous_id = cookieStore.get("ajs_anonymous_id")?.value;
  if (!anonymous_id) {
    return new Response("ajs_anonymous_id cookie is not set", {
      status: 400,
    });
  }
  const traits = await fetchTraits(anonymous_id);
  return new Response(JSON.stringify(traits), {
    status: 200,
  });
}
