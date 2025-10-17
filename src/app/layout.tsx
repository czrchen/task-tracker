import "./globals.css";
import { Toaster } from "sonner"; // 🧩 Import Toaster

export const metadata = {
  title: "EventHub",
  description: "Event calendar and dashboard app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {/* ✅ Toast Notifications (must be inside <body>) */}
        <Toaster
          position="bottom-right" // 👈 optional: can change to 'bottom-right' or 'top-center'
          richColors // enables colored variants
          closeButton // allows users to manually close
        />

        {/* ✅ Global content wrapper */}
        <main className="px-6 md:px-10 lg:px-20 mb-[24px] mt-[20px] md:mt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
