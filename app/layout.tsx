import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import JoinDiscord from "./join-discord";

export const metadata: Metadata = {
  title: "The Void of Iniquity",
  description: "Enter the Void. A dark community beyond the ordinary."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><Providers><JoinDiscord />{children}</Providers></body>
    </html>
  );
}