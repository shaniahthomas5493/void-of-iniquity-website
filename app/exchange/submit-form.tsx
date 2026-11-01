"use client";
import { useState } from "react";
export default function ExchangeSubmitForm() {
  const [type,setType]=useState("author");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    const formElement = event.currentTarget;
    const form=new FormData(formElement);
    const payload=Object.fromEntries(form.entries()); payload.submission_type=type;
    try {
      const response=await fetch("/api/exchange",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json(); if(!response.ok) throw new Error(result.error ?? "Submission failed.");
      setMessage(result.message); formElement.reset();
    } catch(err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setBusy(false); }
  }
  return <form className="exchange-form" onSubmit={submit}>
    <label>YOUR PLACE IN THE EXCHANGE<select value={type} onChange={e=>setType(e.target.value)}><option value="author">The Author's Crypt</option><option value="artisan">The Artisan's Market</option></select></label>
    <label>{type==="author"?"AUTHOR / PEN NAME":"BUSINESS / BRAND NAME"}<input name="display_name" required minLength={2} maxLength={80} placeholder={type==="author"?"Your author name":"Your business name"}/></label>
    <label>{type==="author"?"GENRES":"BUSINESS CATEGORY"}<input name="category" required minLength={2} maxLength={80} placeholder={type==="author"?"Dark romance, fantasy, thriller...":"Art, handmade goods, design..."}/></label>
    <label>YOUR STORY<textarea name="description" required minLength={20} maxLength={1200} rows={5} placeholder="Tell the community about your work..."/></label>
    <label>WEBSITE OR SHOP LINK <span>(OPTIONAL)</span><input name="website_url" type="url" placeholder="https://"/></label>
    <label>SOCIAL PROFILE LINK <span>(OPTIONAL)</span><input name="social_url" type="url" placeholder="https://"/></label>
    <label>FEATURE IMAGE URL <span>(OPTIONAL — HTTPS IMAGE LINK)</span><input name="featured_image_url" type="url" placeholder="https://"/></label>
    <p className="form-note">Submissions are reviewed by the Void Reaper before appearing publicly. Image links only for now; direct uploads will be added separately.</p>
    {message&&<p className="form-success" role="status">{message}</p>}{error&&<p className="form-error" role="alert">{error}</p>}
    <button className="primary-link form-submit" type="submit" disabled={busy}>{busy?"SENDING...":"SUBMIT FOR REVIEW"} <span>→</span></button>
  </form>;
}
