import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { bad, fromPostgres, ok, slugify, workPath } from "@/lib/rest";
import { supabaseAdmin } from "@/lib/supabase";
import type { WorkType } from "@/lib/types";

const workSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  client: z.string().min(1, "العميل مطلوب"),
  year: z.string().min(1, "السنة مطلوبة"),
  description: z.string().default(""),
  image: z.string().nullish(),
  video: z.string().nullish(),
  video2: z.string().nullish(),
  featured: z.boolean().optional(),
  services: z.array(z.string()).default([]),
  position: z.number().int().optional(),
});

type Row = Omit<WorkType, "link">;

/** Rows carry a slug; callers get a ready-made path. */
const withLink = (row: Row): WorkType => ({ ...row, link: workPath(row.slug) });

const blank = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value;

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("works")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) return fromPostgres("works.GET", error);

  return ok({ works: (data as Row[]).map(withLink) });
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let payload: z.infer<typeof workSchema>;
  try {
    payload = workSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return bad("Invalid body");
  }

  const db = supabaseAdmin();

  // Only one project can hold the front page. The database enforces this too,
  // but clearing first turns a constraint violation into a normal update.
  if (payload.featured) await db.from("works").update({ featured: false }).eq("featured", true);

  const { data, error } = await db
    .from("works")
    .insert({
      ...payload,
      image: blank(payload.image),
      video: blank(payload.video),
      video2: blank(payload.video2),
      slug: slugify(payload.title),
    })
    .select()
    .single();

  if (error) return fromPostgres("works.POST", error);

  return ok({ work: withLink(data as Row) }, 201);
}

export async function PUT(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const id = body?.id;
  if (!id) return bad("Work id is required");

  let payload: z.infer<typeof workSchema>;
  try {
    payload = workSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return bad("Invalid body");
  }

  const db = supabaseAdmin();

  if (payload.featured) {
    await db.from("works").update({ featured: false }).eq("featured", true).neq("id", id);
  }

  const { data, error } = await db
    .from("works")
    .update({
      ...payload,
      image: blank(payload.image),
      video: blank(payload.video),
      video2: blank(payload.video2),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return fromPostgres("works.PUT", error);
  if (!data) return bad("Work not found", 404);

  return ok({ work: withLink(data as Row) });
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return bad("Work id is required");

  const { error } = await supabaseAdmin().from("works").delete().eq("id", id);
  if (error) return fromPostgres("works.DELETE", error);

  return ok({ success: true });
}
