import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeOps",
  description: "人生の目標達成をサポートするアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedColor = localStorage.getItem('background-color');
                if (savedColor) {
                  document.documentElement.style.setProperty('--app-background-color', savedColor);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen">
          <Navigation />
          <main className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
