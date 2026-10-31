import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Void of Iniquity",
  description: "Enter the Void. A dark community beyond the ordinary."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}