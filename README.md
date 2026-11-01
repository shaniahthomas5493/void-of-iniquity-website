# The Void of Iniquity

A dark-fantasy community website built with Next.js 15, React 19, TypeScript, and Vercel.

## Current features
- Responsive public landing page
- Discord OAuth sign-in flow (NextAuth)
- Server-side Discord guild membership check using the bot
- Display of selected server roles: Void Reaper, Void Revenants, Ferryman, and Acolytes

## Required environment variables
Add these values in Vercel Project Settings → Environment Variables. Set them for Production, Preview, and Development as appropriate.

- `NEXTAUTH_URL`: `https://void-of-iniquity-website.vercel.app`
- `NEXTAUTH_SECRET`: a long random secret generated privately
- `DISCORD_CLIENT_ID`: Discord application client ID
- `DISCORD_CLIENT_SECRET`: Discord OAuth client secret
- `DISCORD_GUILD_ID`: The Void of Iniquity server ID
- `DISCORD_BOT_TOKEN`: Discord bot token (secret)

In the Discord Developer Portal, add this exact OAuth2 redirect URI:
`https://void-of-iniquity-website.vercel.app/api/auth/callback/discord`

The bot must remain in the guild and be able to read guild member information. Keep the Server Members Intent enabled. Never commit real secrets to GitHub.

## Local development
```bash
npm install
npm run dev
```

## Planned next
Database-backed member profiles, announcements, discussions, events, applications, support tickets, role-protected pages, and staff moderation tools are not implemented yet.
