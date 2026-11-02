"use client";
import { useState } from "react";

async function readResponse(response: Response) {
  const raw = await response.text();
  try { return JSON.parse(raw); }
  catch { throw new Error(response.status === 413 ? "That photo upload is too large. Each photo must be 4 MB or smaller." : "The server returned an unexpected response (" + response.status + "). Please try again."); }
}

export default function ExchangeSubmitForm() {
  const [type,setType]=useState("author");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [selectedCount,setSelectedCount]=useState(0);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(""); setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);

    try {
      if (files.length > 5) throw new Error("You selected " + files.length + " photos. Please choose no more than five.");
      let imageUrls: string[] = [];
      if (files.length) {
        for (const file of files) {
          const uploadData = new FormData();
          uploadData.append("images", file);
          const uploadResponse = await fetch("/api/exchange/upload", { method: "POST", body: uploadData });
          const uploadResult = await readResponse(uploadResponse);
          if (!uploadResponse.ok) throw new Error(uploadResult.error ?? "Image upload failed.");
          imageUrls.push(...(uploadResult.urls ?? []));
        }
      }

      const payload = {
        submission_type: type,
        display_name: String(form.get("display_name") ?? ""),
        category: String(form.get("category") ?? ""),
        description: String(form.get("description") ?? ""),
        website_url: String(form.get("website_url") ?? ""),
        social_url: String(form.get("social_url") ?? ""),
        featured_image_url: String(form.get("featured_image_url") ?? ""),
        image_urls: imageUrls,
      };
      const response = await fetch("/api/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readResponse(response);
      if (!response.ok) throw new Error(result.error ?? "Submission failed.");
      setMessage(result.message);
      formElement.reset();
      setSelectedCount(0);
    } catch(err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="exchange-form" onSubmit={submit}>
    <label>YOUR PLACE IN THE EXCHANGE<select value={type} onChange={e=>setType(e.target.value)}><option value="author">The Author's Crypt</option><option value="artisan">The Artisan's Market</option></select></label>
    <label>{type==="author"?"AUTHOR / PEN NAME":"BUSINESS / BRAND NAME"}<input name="display_name" required minLength={2} maxLength={80} placeholder={type==="author"?"Your author name":"Your business name"}/></label>
    <label>{type==="author"?"GENRES":"BUSINESS CATEGORY"}<input name="category" required minLength={2} maxLength={80} placeholder={type==="author"?"Dark romance, fantasy, thriller...":"Art, handmade goods, design..."}/></label>
    <label>YOUR STORY<textarea name="description" required minLength={20} maxLength={1200} rows={5} placeholder="Tell the community about your work..."/></label>
    <label>WEBSITE OR SHOP LINK <span>(OPTIONAL)</span><input name="website_url" type="url" placeholder="https://"/></label>
    <label>SOCIAL PROFILE LINK <span>(OPTIONAL)</span><input name="social_url" type="url" placeholder="https://"/></label>
    <label>FEATURE IMAGE URL <span>(OPTIONAL — EXTERNAL IMAGE LINK)</span><input name="featured_image_url" type="url" placeholder="https://"/></label>
    <label>UPLOAD PHOTOS <span>(UP TO 5 — JPG, PNG OR WEBP — 4 MB EACH)</span>
      <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>setSelectedCount(e.target.files?.length ?? 0)}/>
    </label>
    <p className="form-note">{selectedCount} of 5 upload slots selected. Uploaded photos will appear in your listing after it is approved. Submissions are reviewed by the Void Reaper before appearing publicly.</p>
    {message&&<p className="form-success" role="status">{message}</p>}{error&&<p className="form-error" role="alert">{error}</p>}
    <button className="primary-link form-submit" type="submit" disabled={busy}>{busy?"SENDING...":"SUBMIT FOR REVIEW"} <span>→</span></button>
  </form>;
}
