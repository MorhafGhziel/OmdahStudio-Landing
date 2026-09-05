import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { bad, fromPostgres, ok } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";

const serviceSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  description: z.string().min(10, "الوصف لا يقل عن ١٠ أحرف"),
  features: z.array(z.string()).min(1, "أضف ميزة واحدة على الأقل"),
  position: z.number().int().optional(),
});

function parse(body: unknown) {
  try {
    return { data: serviceSchema.parse(body), response: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        response: NextResponse.json(
          { error: "Validation failed", details: error.issues },
          { status: 400 }
        ),
      };
    }
    return { data: null, response: bad("Invalid body") };
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("services")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return fromPostgres("services.GET", error);
  return ok({ services: data });
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { data: payload, response } = parse(await request.json().catch(() => null));
  if (!payload) return response;

  const { data, error } = await supabaseAdmin()
    .from("services")
    .insert(payload)
    .select()
    .single();

  if (error) return fromPostgres("services.POST", error);
  return ok({ service: data }, 201);
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return bad("Service id is required");

  const { data: payload, response } = parse(body);
  if (!payload) return response;

  const { data, error } = await supabaseAdmin()
    .from("services")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return fromPostgres("services.PUT", error);
  if (!data) return bad("Service not found", 404);

  return ok({ service: data });
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return bad("Service id is required");

  const { error } = await supabaseAdmin().from("services").delete().eq("id", id);
  if (error) return fromPostgres("services.DELETE", error);

  return ok({ success: true });
}
