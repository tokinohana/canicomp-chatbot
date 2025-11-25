import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EchoChat — Intelligent AI Chatbot",
  description:
    "EchoChat is an AI-powered conversational assistant designed to help users communicate, learn, and create with natural language.",
  keywords: [
    "AI chatbot",
    "conversational AI",
    "EchoChat",
    "natural language processing",
    "chat assistant",
    "AI tools",
    "React",
    "Next.js",
  ],
  authors: [{ name: "EchoChat Team" }],
  icons: {
    icon: "/icons/echochat-logo.svg",
  },
  openGraph: {
    title: "EchoChat — Intelligent AI Chatbot",
    description:
      "An intuitive AI assistant built for natural and productive conversations.",
    url: "https://echochat.app",
    siteName: "EchoChat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoChat — Intelligent AI Chatbot",
    description:
      "Experience seamless conversations with a modern AI-powered chat companion.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
