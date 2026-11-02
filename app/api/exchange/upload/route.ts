import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { authOptions } from "../../auth/auth-options";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export const runtime = "nodejs";

const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.guildMember) {
    return NextResponse.json({ error: "Sign in with a verified Void member account to upload images." }, { status: 403 });
  }

  let form: FormData;
  try { form = await request.formData(); }
  catch { return NextResponse.json({ error: "No upload data was received." }, { status: 400 }); }

  const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (!files.length) return NextResponse.json({ urls: [] });
  if (files.length > MAX_FILES) return NextResponse.json({ error: "Choose no more than five images." }, { status: 400 });
  if (files.some(file => !allowedTypes[file.type] || file.size > MAX_BYTES)) {
    return NextResponse.json({ error: "Images must be JPG, PNG, or WebP and no larger than 5 MB each." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const urls: string[] = [];
  for (const file of files) {
    const extension = allowedTypes[file.type];
    const path = `${session.user.id}/${randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from("exchange-images").upload(path, bytes, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000",
    });
    if (error) {
      console.error("Exchange image upload failed:", error);
      return NextResponse.json({ error: "An image could not be uploaded. Please try again." }, { status: 500 });
    }
    const { data } = supabase.storage.from("exchange-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return NextResponse.json({ urls });
}
