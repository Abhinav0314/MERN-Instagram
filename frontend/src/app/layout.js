import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Providers from "@/components/Providers";
import BootstrapClient from "@/components/BootstrapClient";
import Navbar from "@/components/Layout/Navbar";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Instagram",
  description: "A beautiful Instagram clone built with Next.js and MERN stack.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            })();
          `}
        </Script>
        <Script id="hide-logs" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              const originalLog = console.log;
              const originalWarn = console.warn;
              const originalError = console.error;
              const originalInfo = console.info;
              
              const shouldIgnore = (args) => {
                if (typeof args[0] === 'string') {
                  const msg = args[0];
                  return msg.includes('[Fast Refresh]') || 
                         msg.includes('[HMR]') || 
                         msg.includes('React DevTools') ||
                         msg.includes('Largest Contentful Paint') ||
                         msg.includes('scroll-behavior: smooth') ||
                         msg.includes('A tree hydrated but some attributes') ||
                         msg.includes('Hydration failed because the initial UI does not match') ||
                         msg.includes('There was an error while hydrating') ||
                         msg.includes('bis_skin_checked') ||
                         msg.includes('Warning: Expected server HTML to contain a matching');
                }
                return false;
              };

              console.log = function (...args) {
                if (shouldIgnore(args)) return;
                originalLog.apply(console, args);
              };

              console.warn = function (...args) {
                if (shouldIgnore(args)) return;
                originalWarn.apply(console, args);
              };

              console.error = function (...args) {
                if (shouldIgnore(args)) return;
                originalError.apply(console, args);
              };
              
              console.info = function (...args) {
                if (shouldIgnore(args)) return;
                originalInfo.apply(console, args);
              };
            }
          `}
        </Script>
        <Providers>
          <Navbar />
          <main className="pb-5">
            {children}
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
        <BootstrapClient />
      </body>
    </html>
  );
}
