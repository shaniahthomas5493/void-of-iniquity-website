import { getSupabaseAdmin } from "../../lib/supabase";
export default async function ExchangeListings(){
 let listings:Array<{id:string;submission_type:string;display_name:string;description:string;category:string;website_url:string|null;social_url:string|null;featured_image_url:string|null;image_urls:string[]}>=[];
 try{const {data}=await getSupabaseAdmin().from("exchange_submissions").select("id,submission_type,display_name,description,category,website_url,social_url,featured_image_url,image_urls").eq("status","approved").order("created_at",{ascending:false});listings=data??[];}catch{}
 if(!listings.length)return null;
 return <div className="approved-listings"><div className="approved-heading"><p className="eyebrow">FROM WITHIN THE VOID</p><h3>THE COMMUNITY <em>COLLECTION</em></h3></div><div className="approved-grid">{listings.map(item=><article className="approved-card" key={item.id}>
 {(item.image_urls?.length ? item.image_urls : item.featured_image_url ? [item.featured_image_url] : []).length>0&&<div className="approved-gallery">{(item.image_urls?.length ? item.image_urls : item.featured_image_url ? [item.featured_image_url] : []).map((url,index)=><a href={url} target="_blank" rel="noreferrer" key={url}><img src={url} alt={`${item.display_name} photo ${index+1}`} loading="lazy"/></a>)}</div>}
 <span>{item.submission_type==="author"?"THE AUTHOR'S CRYPT":"THE ARTISAN'S MARKET"}</span><h4>{item.display_name}</h4><p className="approved-category">{item.category}</p><p>{item.description}</p><div>{item.website_url&&<a href={item.website_url} target="_blank" rel="noreferrer">VISIT ↗</a>}{item.social_url&&<a href={item.social_url} target="_blank" rel="noreferrer">SOCIAL ↗</a>}</div></article>)}</div></div>;
}
