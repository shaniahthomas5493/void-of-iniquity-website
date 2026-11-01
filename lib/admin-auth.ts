import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/auth-options";

export const VOID_REAPER_ROLE_ID = "1495636529488461834";

export async function getVoidReaperSession() {
  const session = await getServerSession(authOptions);
  const roles = session?.user?.discordRoles ?? [];

  if (!session?.user?.guildMember || !roles.includes(VOID_REAPER_ROLE_ID)) {
    return null;
  }

  return session;
}
