import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/lib/toast";

export const metadata: Metadata = {
  title: "Recovery Companion",
  description: "Turn your discharge instructions into a simple recovery journey.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#3355C9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="app-shell">
          <StoreProvider>
            <ToastProvider>
              <div className="relative flex h-full min-h-0 flex-1 flex-col">
                {children}
              </div>
            </ToastProvider>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
