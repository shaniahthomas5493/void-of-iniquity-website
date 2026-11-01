import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/auth-options";
import ExchangeSubmitForm from "./submit-form";
export default async function ExchangeSubmitPage() {
 const session=await getServerSession(authOptions);
 if(!session?.user?.guildMember) redirect("/");
 return <main className="exchange-submit-page">
  <nav className="nav"><a className="brand" href="/"><span className="brand-mark">V</span><span>THE VOID <i>OF INIQUITY</i></span></a><a className="nav-link" href="/">RETURN TO THE REALM <span>↗</span></a></nav>
  <section className="submit-hero"><p className="eyebrow">A PLACE FOR THE CREATORS</p><h1>THE INFERNAL<br/><em>EXCHANGE</em></h1><p>Put your craft before the community. Every submission is reviewed before it earns a place in the realm.</p></section>
  <section className="submit-content"><div className="submit-intro"><p className="eyebrow">CREATOR APPLICATION</p><h2>MAKE YOURSELF<br/><em>KNOWN.</em></h2><p>Welcome, {session.user.name ?? "Void Member"}. Complete the form below to submit your author or artisan profile.</p></div><ExchangeSubmitForm/></section>
  <footer><span>THE VOID OF INIQUITY</span><span>ASHES FADE. THE VOID REMAINS.</span></footer>
 </main>;
}
