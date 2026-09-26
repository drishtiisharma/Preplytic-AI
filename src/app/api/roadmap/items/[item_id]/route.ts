import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ item_id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { item_id: itemId } = await params;
    if (!itemId) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    const body = await request.json();
    let { progress, status } = body;

    // Filter out any other fields to prevent overriding AI-generated data
    if (progress === undefined && status === undefined) {
      return NextResponse.json({ error: "No valid fields to update. Only progress and status are allowed." }, { status: 400 });
    }

    // Apply constraints
    if (progress !== undefined) {
      progress = Math.max(0, Math.min(100, Number(progress)));
      if (progress === 100) {
        status = "completed";
      }
    }

    if (status !== undefined) {
      if (!["not_started", "in_progress", "completed"].includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      if (status === "completed") {
        progress = 100;
      }
    }

    // Verify ownership: We need to check if the item belongs to a roadmap owned by the user.
    // We can do this efficiently by querying the item and joining its parents.
    const { data: existingItem, error: fetchError } = await supabase
      .from("roadmap_items")
      .select("id, status, progress, roadmap_versions(roadmaps(user_id))")
      .eq("id", itemId)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // @ts-ignore - deeply nested Supabase response types can be tricky
    const itemUserId = existingItem.roadmap_versions?.roadmaps?.user_id;

    if (itemUserId !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Perform the update
    const updateData: any = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;

    const { data: updatedItem, error: updateError } = await supabase
      .from("roadmap_items")
      .update(updateData)
      .eq("id", itemId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update item", details: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedItem });

  } catch (error: any) {
    console.error("Update roadmap item error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}