import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const recognizedRoleIds = [
  "1495636529488461834",
  "1495636936075903027",
  "1524785126163091526",
  "1515430083601502369"
];

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      issuer: "https://discord.com",
      authorization: { params: { scope: "identify" } }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account && token.sub) {
        const guildId = process.env.DISCORD_GUILD_ID;
        const botToken = process.env.DISCORD_BOT_TOKEN;
        token.guildCheckConfigured = Boolean(guildId && botToken);

        if (guildId && botToken) {
          try {
            const response = await fetch(
              `https://discord.com/api/v10/guilds/${guildId}/members/${token.sub}`,
              {
                headers: { Authorization: `Bot ${botToken}` },
                cache: "no-store"
              }
            );

            if (response.ok) {
              const member = await response.json();
              const memberRoles: string[] = Array.isArray(member.roles) ? member.roles : [];
              token.guildMember = true;
              token.discordRoles = memberRoles.filter((id) => recognizedRoleIds.includes(id));
            } else {
              token.guildMember = false;
              token.discordRoles = [];
            }
          } catch {
            token.guildMember = false;
            token.discordRoles = [];
          }
        } else {
          token.guildMember = false;
          token.discordRoles = [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.guildMember = Boolean(token.guildMember);
        session.user.guildCheckConfigured = Boolean(token.guildCheckConfigured);
        session.user.discordRoles = Array.isArray(token.discordRoles) ? token.discordRoles as string[] : [];
      }
      return session;
    }
  },
  pages: { signIn: "/" }
};
