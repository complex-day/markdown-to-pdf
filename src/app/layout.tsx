import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markdown to PDF Converter | GitHub-Flavored A4 Exporter",
  description: "Convert GitHub Flavored Markdown (.md) documents into high-fidelity A4 PDFs matching browser rendering.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-100 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
