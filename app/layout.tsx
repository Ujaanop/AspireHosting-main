import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Orbitron, Quicksand } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { LayoutWrapper } from "./components/layout-wrapper";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import CookieConsent from "./components/CookieConsent";
import ThemeSwitcher from "./components/ThemeSwitcher";
import MaintenancePopup from "./components/MaintenancePopup";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
// hi there
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
});
// hello again
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a8a" }
  ],
}

export const metadata: Metadata = {
  title: {
    default: "Aspire Hosting - Game Hosting, VPS & Dedicated Servers",
    template: "%s | Aspire Hosting"
  },
  description: "Premium game hosting, VPS & dedicated servers by Aspire Hosting. High-performance infrastructure with 99.9% uptime, DDoS protection & 24/7 support.",
  keywords: [
    "game hosting",
    "minecraft hosting",
    "discord bot hosting",
    "VPS hosting",
    "dedicated servers",
    "cloud servers",
    "gaming servers",
    "Aspire Hosting",
    "low latency hosting",
    "DDoS protection",
    "24/7 support",
    "custom server hosting",
    "modded game hosting",
    "server rental"
  ],
  authors: [{ name: "Anthony" }],
  creator: "Anthony",
  publisher: "Aspire Hosting",
  category: "Game Hosting & Server Solutions",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://my.aspirehosting.in",
    siteName: "Aspire Hosting - Game Hosting & Servers",
    title: "Aspire Hosting - Game Hosting, VPS & Dedicated Servers",
    description: "Premium game hosting, VPS, and dedicated server solutions. High-performance infrastructure for gaming communities and developers with DDoS protection.",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Aspire Hosting - Game Hosting, VPS & Dedicated Servers",
        type: "image/png"
      }
    ]
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Aspire Hosting - Game Hosting, VPS & Dedicated Servers",
    description: "Premium game hosting and server solutions. High-performance infrastructure for gaming communities with DDoS protection and 24/7 support.",
    images: [""]
  },

  // Additional metadata with bot protection
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: "vzsKvhNUgAPlCbf1annB0Sl-bttSFos87mhOyQSU2aY", // Replace with actual verification code
  },

  applicationName: "Aspire Hosting",
  referrer: "origin-when-cross-origin",

  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "", sizes: "32x32", type: "image/png" },
      { url: "", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ""
  },

  alternates: {
    canonical: "https://my.aspirehosting.in"
  },
  other: {
    "msapplication-TileColor": "#1e40af",
    "msapplication-config": "/browserconfig.xml",
    "terms-of-service": "https://my.aspirehosting.in/terms-of-services",
    "privacy-policy": "https://my.aspirehosting.in/privacy-policy"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aspire Hosting" />
        <meta name="crawl-delay" content="10" />
        <meta name="revisit-after" content="7 days" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aspire Hosting",
              "url": "https://my.aspirehosting.in",
              "logo": "",
              "description": "Premium game hosting, VPS, and dedicated server solutions for gaming communities and developers",
              "serviceType": ["Game Server Hosting", "VPS Hosting", "Dedicated Servers", "Cloud Infrastructure"],
              "areaServed": "Worldwide",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Gaming & Server Solutions",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Game Server Hosting",
                      "description": "High-performance game servers with DDoS protection"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "VPS Hosting",
                      "description": "Virtual private servers with full root access"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Dedicated Servers",
                      "description": "Bare metal servers for maximum performance"
                    }
                  }
                ]
              },
              "sameAs": [
                "https://discord.gg/Qrzn2enUP2"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": "English",
                "serviceType": "Technical Support",
                "url": "https://discord.gg/Qrzn2enUP2"
              },
              "founder": {
                "@type": "Person",
                "name": "Anthony "
              },
              "termsOfService": "https://my.aspirehosting.in/terms-of-services",
              "privacyPolicy": "https://my.aspirehosting.in/privacy-policy"
            })
          }}
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FVZBM6NBR5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FVZBM6NBR5');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${quicksand.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <CurrencyProvider>
              <LayoutWrapper>
                {children}
                <Analytics />
              </LayoutWrapper>
              <CookieConsent />
              <ThemeSwitcher />
              <MaintenancePopup />
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
