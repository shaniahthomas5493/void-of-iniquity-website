"use client";
import { useEffect,useState } from "react";
import { useSession,signIn } from "next-auth/react";
type Reply={id:string;user_id:string;discord_name:string;content:string;created_at:string};
type Topic={id:string;user_id:string;discord_name:string;title:string;category:string;content:string;created_at:string;gathering_replies:Reply[]};
const REAPER="1495636529488461834";
export default function Gathering(){
 const {data:session}=useSession();
 const member=Boolean(session?.user?.guildMember);
 const reaper=Boolean(member&&session?.user?.discordRoles?.includes(REAPER));
 const [topics,setTopics]=useState<Topic[]>([]);
 const [title,setTitle]=useState("");const [category,setCategory]=useState("General");const [content,setContent]=useState("");
 const [replies,setReplies]=useState<Record<string,string>>({});
 const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const [error,setError]=useState("");
 async function load(){setLoading(true);try{const r=await fetch("/api/gathering",{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.error);setTopics(d.topics??[]);setError("");}catch(e){setError(e instanceof Error?e.message:"Could not load discussions.");}finally{setLoading(false);}}
 useEffect(()=>{load();},[]);
 async function send(body:Record<string,string>,method:"POST"|"PATCH"|"DELETE"){setBusy(true);setError("");setMessage("");try{const r=await fetch("/api/gathering",{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error);setMessage(d.message);await load();return true;}catch(e){setError(e instanceof Error?e.message:"Something went wrong.");return false;}finally{setBusy(false);}}
 async function create(e:React.FormEvent){e.preventDefault();if(await send({title,category,content},"POST")){setTitle("");setContent("");}}
 async function reply(topicId:string){const text=replies[topicId]?.trim();if(!text)return;if(await send({topic_id:topicId,content:text},"PATCH"))setReplies(v=>({...v,[topicId]:""}));}
 async function remove(id:string,kind:"topic"|"reply"){if(!window.confirm("Remove this discussion item permanently?"))return;await send({id,kind},"DELETE");}
 return <section className="gathering-content">
  <div className="gathering-intro"><p className="eyebrow">THE CONVERSATION CONTINUES</p><h2>TAKE YOUR <em>PLACE</em></h2><p>Read what the community is talking about, open a new discussion, or carry the conversation into Discord.</p><a className="gathering-discord" href="https://discord.com/channels/1495621533232791552" target="_blank" rel="noreferrer">OPEN THE VOID ON DISCORD ↗</a></div>
  {!member&&<div className="gathering-gate"><h3>YOUR VOICE HAS A PLACE HERE</h3><p>Sign in with Discord and verify your Void membership to create discussions and reply. Everyone can read the public conversation.</p><button className="primary-link" onClick={()=>signIn("discord")}>SIGN IN WITH DISCORD →</button></div>}
  {member&&<form className="gathering-form" onSubmit={create}><h3>OPEN A DISCUSSION</h3><label>DISCUSSION TITLE<input required minLength={3} maxLength={120} value={title} onChange={e=>setTitle(e.target.value)} placeholder="What is on your mind?"/></label><label>CATEGORY<select value={category} onChange={e=>setCategory(e.target.value)}>{["General","Introductions","Questions","Books & Writing","Gaming","Events"].map(x=><option key={x}>{x}</option>)}</select></label><label>YOUR MESSAGE<textarea required minLength={3} maxLength={8000} rows={5} value={content} onChange={e=>setContent(e.target.value)} placeholder="Start the conversation..."/></label><button className="primary-link" disabled={busy}>POST DISCUSSION →</button></form>}
  {message&&<p className="form-success">{message}</p>}{error&&<p className="form-error">{error}</p>}
  <div className="gathering-feed-heading"><h2>OPEN <em>CONVERSATIONS</em></h2><span>{topics.length} DISCUSSIONS</span></div>
  {loading?<p className="gathering-empty">Opening the gathering...</p>:topics.length===0?<p className="gathering-empty">No discussions have begun yet. Be the first to open one.</p>:<div className="gathering-feed">{topics.map(topic=><article className="gathering-topic" key={topic.id}><div className="gathering-topic-meta"><span>{topic.category}</span><time>{new Date(topic.created_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</time></div><h3>{topic.title}</h3><p className="gathering-author">Started by {topic.discord_name}</p><div className="gathering-topic-body">{topic.content.split("\n").map((line,i)=><p key={i}>{line||" "}</p>)}</div>{reaper&&<button className="secondary-button" onClick={()=>remove(topic.id,"topic")}>REMOVE DISCUSSION</button>}<div className="gathering-replies"><h4>REPLIES · {topic.gathering_replies?.length??0}</h4>{(topic.gathering_replies??[]).map(reply=><div className="gathering-reply" key={reply.id}><strong>{reply.discord_name}</strong><p>{reply.content}</p>{reaper&&<button onClick={()=>remove(reply.id,"reply")}>REMOVE</button>}</div>)}</div>{member?<div className="gathering-reply-form"><textarea rows={2} maxLength={4000} value={replies[topic.id]??""} onChange={e=>setReplies(v=>({...v,[topic.id]:e.target.value}))} placeholder="Add to the conversation..."/><button className="secondary-button" disabled={busy||!replies[topic.id]?.trim()} onClick={()=>reply(topic.id)}>REPLY</button></div>:<p className="gathering-reply-prompt">Sign in with Discord to reply.</p>}</article>)}</div>}
 </section>;
}