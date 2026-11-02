import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";
import {randomUUID} from "crypto";
import {authOptions} from "../../auth/auth-options";
import {getSupabaseAdmin} from "../../../../lib/supabase";
export const runtime="nodejs";
const types:Record<string,string>={"image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
export async function POST(req:Request){
 const session=await getServerSession(authOptions);
 if(!session?.user?.id||!session.user.guildMember)return NextResponse.json({error:"A verified Void member account is required to upload."},{status:403});
 let form:FormData;try{form=await req.formData();}catch{return NextResponse.json({error:"No image was received."},{status:400});}
 const file=form.get("image");
 if(!(file instanceof File)||!file.size)return NextResponse.json({error:"Choose an image to upload."},{status:400});
 if(!types[file.type]||file.size>5*1024*1024)return NextResponse.json({error:"Use a JPG, PNG, or WebP image no larger than 5 MB."},{status:400});
 const path=`${session.user.id}/${randomUUID()}.${types[file.type]}`;
 const {error}=await getSupabaseAdmin().storage.from("reliquary-images").upload(path,Buffer.from(await file.arrayBuffer()),{contentType:file.type,upsert:false,cacheControl:"31536000"});
 if(error){console.error("Reliquary image upload failed:",error);return NextResponse.json({error:"Image upload failed. Please try again."},{status:500});}
 const {data}=getSupabaseAdmin().storage.from("reliquary-images").getPublicUrl(path);
 return NextResponse.json({url:data.publicUrl});
}