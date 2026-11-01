"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const roles = [
  { id: "1495636529488461834", name: "Void Reaper" },
  { id: "1495636936075903027", name: "Void Revenants" },
  { id: "1524785126163091526", name: "Ferryman" },
  { id: "1515430083601502369", name: "Acolytes" }
];

export default function CommunityPanel() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <section className="community-panel" id="community">
      <p className="eyebrow">THE GATEWAY</p>
      <h2>YOUR PLACE IN <em>THE VOID.</em></h2>
      {status === "loading" ? (
        <p className="community-note">Opening the gateway...</p>
      ) : !user ? (
        <>
          <p className="community-note">Sign in with Discord to verify your place in the realm and access member features.</p>
          <button className="primary-link community-button" onClick={() => signIn("discord")}>SIGN IN WITH DISCORD <span>→</span></button>
        </>
      ) : !user.guildCheckConfigured ? (
        <>
          <p className="community-note">Discord sign-in is connected. Server verification is waiting for the site administrator to finish secure server configuration.</p>
          <button className="secondary-button" onClick={() => signOut()}>SIGN OUT</button>
        </>
      ) : !user.guildMember ? (
        <>
          <p className="community-note">Your Discord account is signed in, but we could not verify membership in The Void of Iniquity. Join the Discord server, then sign in again.</p>
          <button className="secondary-button" onClick={() => signOut()}>SIGN OUT</button>
        </>
      ) : (
        <>
          <p className="community-note">Welcome back, {user.name ?? "traveller"}. Your membership has been verified.</p>
          <div className="role-list">
            {(user.discordRoles ?? []).map((id) => {
              const role = roles.find((item) => item.id === id);
              return role ? <span className="role-chip" key={id}>{role.name}</span> : null;
            })}
            {(user.discordRoles ?? []).length === 0 && <span className="role-chip">Verified Member</span>}
          </div>
          <button className="secondary-button" onClick={() => signOut()}>SIGN OUT</button>
        </>
      )}
    </section>
  );
}