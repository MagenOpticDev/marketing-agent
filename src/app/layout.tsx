import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "מגן אופטיק - סוכן שיווק AI",
  description: "פלטפורמת AI לשיווק ומכירות - מגן אופטיק בע\"מ",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              fontSize: "14px",
              fontFamily: "'Noto Sans Hebrew', system-ui",
              direction: "rtl",
            },
          }}
        />
      </body>
    </html>
  );
}
