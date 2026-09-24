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

    // 1. Fetch roadmap and verify user_id
    const { data: roadmap, error: roadmapError } = await supabase
      .from("roadmaps")
      .select("*")
      .eq("id", roadmapId)
      .eq("user_id", user.id)
      .single();

    if (roadmapError || !roadmap) {
      return NextResponse.json({ error: "Roadmap not found or access denied." }, { status: 404 });
    }
    
    // 2. Fetch current roadmap_versions using current_version -> all roadmap_items for that version
    const { data: currentVersion, error: versionError } = await supabase
      .from("roadmap_versions")
      .select("*, roadmap_items(*)")
      .eq("roadmap_id", roadmapId)
      .eq("version_number", roadmap.current_version)
      .single();

    if (versionError && versionError.code !== 'PGRST116') {
      console.error("Version error:", versionError);
      return NextResponse.json({ error: "Failed to fetch roadmap version." }, { status: 500 });
    }

    // Return complete saved roadmap
    const completeRoadmap = {
       ...roadmap,
       roadmap_versions: currentVersion ? [currentVersion] : []
    };

    return NextResponse.json({ success: true, data: completeRoadmap });

  } catch (error: any) {
    console.error("Fetch roadmap error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}