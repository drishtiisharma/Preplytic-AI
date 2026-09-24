import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roadmapId = params.id;

    if (!roadmapId) {
      return NextResponse.json({ error: "Missing roadmap ID" }, { status: 400 });
    }

    // Fetch roadmap and nested versions/items. RLS ensures we only get it if it belongs to the user.
    // However, we explicitly check user_id to match the requirement.
    const { data: roadmap, error: roadmapError } = await supabase
      .from("roadmaps")
      .select("*, roadmap_versions(*, roadmap_items(*))")
      .eq("id", roadmapId)
      .eq("user_id", user.id)
      .single();

    if (roadmapError || !roadmap) {
      return NextResponse.json({ error: "Roadmap not found or access denied." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: roadmap });

  } catch (error: any) {
    console.error("Fetch roadmap error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}