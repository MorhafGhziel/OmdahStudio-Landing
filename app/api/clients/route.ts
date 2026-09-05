import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { bad, fromPostgres, ok } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";

const clientSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  logo: z.string().min(1, "الشعار مطلوب"),
  position: z.number().int().optional(),
});

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("clients")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return fromPostgres("clients.GET", error);
  return ok({ clients: data });
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let payload: z.infer<typeof clientSchema>;
  try {
    payload = clientSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return bad("Invalid body");
  }

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .insert(payload)
    .select()
    .single();

  if (error) return fromPostgres("clients.POST", error);
  return ok({ client: data }, 201);
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return bad("Client id is required");

  const { data, error } = await supabaseAdmin()
    .from("clients")
    .update({ name: body.name, logo: body.logo, position: body.position })
    .eq("id", id)
    .select()
    .single();

  if (error) return fromPostgres("clients.PUT", error);
  if (!data) return bad("Client not found", 404);

  return ok({ client: data });
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return bad("Client id is required");

  const { error } = await supabaseAdmin().from("clients").delete().eq("id", id);
  if (error) return fromPostgres("clients.DELETE", error);

  return ok({ success: true });
}
