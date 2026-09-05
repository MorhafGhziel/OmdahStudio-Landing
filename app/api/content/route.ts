import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { bad, fromPostgres, ok } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";

const contentSchema = z.object({
  section: z.string().min(1),
  data: z.record(z.string(), z.unknown()),
});

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("site_content")
    .select("section, data");

  if (error) return fromPostgres("content.GET", error);

  const content: Record<string, unknown> = {};
  for (const row of data ?? []) content[row.section] = row.data;

  return ok({ content });
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let payload: z.infer<typeof contentSchema>;
  try {
    payload = contentSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return bad("Invalid body");
  }

  const { error } = await supabaseAdmin()
    .from("site_content")
    .upsert(
      { section: payload.section, data: payload.data, updated_at: new Date().toISOString() },
      { onConflict: "section" }
    );

  if (error) return fromPostgres("content.PUT", error);
  return ok({ message: "Content updated" });
}
