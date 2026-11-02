"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  user_id: string; discord_name: string; avatar_url: string | null; discord_roles: string[];
  display_name: string | null; last_seen_at: string | null;
  management: null | { display_name: string; rank_label: string; access_status: string; standing: string; warnings: number; commendations: number; staff_notes: string };
};
const ranks = ["Unassigned", "Acolyte", "Ferryman", "Void Revenant", "Void Reaper"];
const accesses = ["active", "restricted", "suspended", "departed"];
const standings = ["good", "watch", "warning", "probation"];
const empty = { display_name: "", rank_label: "Unassigned", access_status: "active", standing: "good", warnings: 0, commendations: 0, staff_notes: "" };

export default function MemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/member-management", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load members.");
      setMembers(data.members || []);
      setSelectedId((current: string) => current || data.members?.[0]?.user_id || "");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load members."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => members.filter((m) => (m.display_name || m.management?.display_name || m.discord_name).toLowerCase().includes(search.toLowerCase()) || m.discord_name.toLowerCase().includes(search.toLowerCase())), [members, search]);
  const selected = members.find((m) => m.user_id === selectedId) || null;
  const flaggedMembers = members.filter((m) => {
    const record = m.management;
    return Boolean(record && (record.warnings > 0 || record.standing === "watch" || record.standing === "probation"));
  }).sort((a, b) => (b.management!.warnings - a.management!.warnings) || a.discord_name.localeCompare(b.discord_name));
  useEffect(() => {
    if (!selected) { setForm(empty); return; }
    setForm({ ...empty, ...(selected.management || {}), display_name: selected.management?.display_name || selected.display_name || "" });
  }, [selectedId, members]);

  async function save() {
    if (!selected) return;
    setSaving(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/member-management", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: selected.user_id, discord_name: selected.discord_name, ...form }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setMessage("Member record saved.");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed."); }
    finally { setSaving(false); }
  }

  return <section className="member-management">
    <div className="mm-heading"><p className="eyebrow">THE INNER SANCTUM</p><h1>MEMBER <em>MANAGEMENT</em></h1><p>Website-only records for access planning and community standing. These settings do not change Discord roles or server permissions.</p></div>
    {error && <p className="mm-error">{error}</p>}{message && <p className="mm-success">{message}</p>}
    <div className="mm-layout">
      <aside className="mm-roster"><label htmlFor="mm-search">SEARCH MEMBERS</label><input id="mm-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..." />
        {loading ? <p>Loading member roster...</p> : filtered.length ? filtered.map((member) => <button key={member.user_id} className={selectedId === member.user_id ? "mm-member selected" : "mm-member"} onClick={() => setSelectedId(member.user_id)}><strong>{member.management?.display_name || member.display_name || member.discord_name}</strong><span>{member.discord_name}</span></button>) : <p>No registered members found.</p>}
      </aside>
      <div className="mm-editor">{selected ? <>
        <div className="mm-profile">{selected.avatar_url && <img src={selected.avatar_url} alt="" />}<div><h2>{selected.management?.display_name || selected.display_name || selected.discord_name}</h2><p>{selected.discord_name}</p></div></div>
        <div className="mm-fields">
          <label>WEBSITE DISPLAY NAME<input value={form.display_name} maxLength={80} onChange={(e) => setForm({ ...form, display_name: e.target.value })} /></label>
          <label>RECORDED RANK<select value={form.rank_label} onChange={(e) => setForm({ ...form, rank_label: e.target.value })}>{ranks.map((v) => <option key={v}>{v}</option>)}</select></label>
          <label>WEBSITE ACCESS STATUS<select value={form.access_status} onChange={(e) => setForm({ ...form, access_status: e.target.value })}>{accesses.map((v) => <option key={v} value={v}>{v.replace("_", " ")}</option>)}</select></label>
          <label>COMMUNITY STANDING<select value={form.standing} onChange={(e) => setForm({ ...form, standing: e.target.value })}>{standings.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
          <label>WARNINGS<input type="number" min="0" max="999" value={form.warnings} onChange={(e) => setForm({ ...form, warnings: Number(e.target.value) })} /></label>
          <label>COMMENDATIONS<input type="number" min="0" max="999" value={form.commendations} onChange={(e) => setForm({ ...form, commendations: Number(e.target.value) })} /></label>
        </div>
        <label className="mm-notes">PRIVATE STAFF NOTES<textarea rows={6} maxLength={5000} value={form.staff_notes} onChange={(e) => setForm({ ...form, staff_notes: e.target.value })} placeholder="Visible only to Void Reapers..." /></label>
        <button className="mm-save" onClick={save} disabled={saving}>{saving ? "SAVING..." : "SAVE MEMBER RECORD"}</button>
      </> : <p>Select a member to view their record.</p>}</div>

    </div>
    <section className="mm-flagged">
      <div className="mm-flagged-heading"><p className="eyebrow">STAFF FOLLOW-UP</p><h2>MEMBERS REQUIRING <em>ATTENTION</em></h2><p>Members with one or more recorded warnings, a watch status, or probation.</p></div>
      {flaggedMembers.length ? <div className="mm-flagged-list">{flaggedMembers.map((member) => {
        const record = member.management!;
        return <button type="button" key={member.user_id} className="mm-flagged-member" onClick={() => { setSelectedId(member.user_id); setMessage(""); }}>
          <span className="mm-flagged-name"><strong>{record.display_name || member.display_name || member.discord_name}</strong><small>{member.discord_name} · {record.rank_label}</small></span>
          <span className="mm-flagged-status">{record.warnings > 0 ? String(record.warnings) + (record.warnings === 1 ? " warning" : " warnings") : "No warnings"}</span>
          <span className="mm-flagged-status">{record.standing}</span>
          <span className="mm-flagged-status">{record.access_status}</span>
        </button>;
      })}</div> : <p className="mm-clear">No members currently meet these follow-up criteria.</p>}
    </section>
  </section>;
}
