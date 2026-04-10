import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";
import { MainLayout } from "@/components/layout/MainLayout";
import { UserProvider } from "@/providers/user-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrackSarkar",
  description: "AI-powered exam preparation platform for CrackSarkar Group II, III, and IV.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
