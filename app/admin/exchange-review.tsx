"use client";
import { useEffect,useState } from "react";
type Submission={id:string;submission_type:"author"|"artisan";display_name:string;discord_name:string;description:string;category:string;website_url:string|null;social_url:string|null;featured_image_url:string|null;status:"pending"|"approved"|"rejected";created_at:string};
export default function ExchangeReview(){
 const [items,setItems]=useState<Submission[]>([]); const [error,setError]=useState(""); const [busy,setBusy]=useState("");
 async function load(){const r=await fetch("/api/exchange/admin",{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.error??"Unable to load submissions.");setItems(d.submissions??[]);}
 useEffect(()=>{load().catch(e=>setError(e instanceof Error?e.message:"Unable to load submissions."));},[]);
 async function review(id:string,status:"approved"|"rejected"){setBusy(id);setError("");try{const r=await fetch("/api/exchange/admin",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});const d=await r.json();if(!r.ok)throw new Error(d.error??"Review action failed.");await load();}catch(e){setError(e instanceof Error?e.message:"Review action failed.");}finally{setBusy("");}}
 const pending=items.filter(x=>x.status==="pending");
 return <section className="review-section"><div className="review-heading"><div><p className="eyebrow">THE INFERNAL EXCHANGE</p><h2>CREATOR <em>REVIEW QUEUE</em></h2></div><span className="review-count">{pending.length} PENDING</span></div>
 {error&&<p className="form-error" role="alert">{error}</p>}
 {items.length===0?<p className="review-empty">No creator submissions have arrived yet.</p>:<div className="review-list">{items.map(item=><article className="review-card" key={item.id}>
 <div className="review-card-top"><span>{item.submission_type==="author"?"AUTHOR'S CRYPT":"ARTISAN'S MARKET"}</span><span className={"review-status status-"+item.status}>{item.status.toUpperCase()}</span></div>
 <h3>{item.display_name}</h3><p className="review-meta">{item.category} · Submitted by {item.discord_name} · {new Date(item.created_at).toLocaleDateString()}</p><p className="review-description">{item.description}</p>
 <div className="review-links">{item.website_url&&<a href={item.website_url} target="_blank" rel="noreferrer">Website / Shop ↗</a>}{item.social_url&&<a href={item.social_url} target="_blank" rel="noreferrer">Social profile ↗</a>}{item.featured_image_url&&<a href={item.featured_image_url} target="_blank" rel="noreferrer">Feature image ↗</a>}</div>
 {item.status==="pending"&&<div className="review-actions"><button disabled={busy===item.id} onClick={()=>review(item.id,"approved")}>APPROVE</button><button disabled={busy===item.id} onClick={()=>review(item.id,"rejected")}>REJECT</button></div>}
 </article>)}</div>}</section>;
}
