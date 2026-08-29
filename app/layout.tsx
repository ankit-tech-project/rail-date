import type { Metadata } from "next";
import { Lexend, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rail-date.vercel.app"),

  title: {
    default: "RailDate — Indian Railway Ticket Booking Date Calculator",
    template: "%s | RailDate",
  },

  description:
    "Find out exactly when your Indian Railway train ticket booking opens. Select your journey date and instantly calculate your train ticket booking date.",

  keywords: [
    "RailDate",
    "Rail Date",
    "train ticket booking date calculator",
    "Indian Railway ticket booking date",
    "train ticket booking date",
    "train ticket booking calculator",
    "Indian Railway booking date calculator",
    "60 day train ticket booking",
    "Indian Railway advance reservation",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "RailDate — Indian Railway Ticket Booking Date Calculator",

    description:
      "Select your journey date and instantly find out when your Indian Railway train ticket booking opens.",

    url: "https://rail-date.vercel.app/",

    siteName: "RailDate",

    type: "website",

    locale: "en_IN",
  },

  twitter: {
    card: "summary",
    title: "RailDate — Indian Railway Ticket Booking Date Calculator",

    description:
      "Find out when your train ticket booking window opens based on your journey date.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "RailDate",
    url: "https://rail-date.vercel.app/",
    description:
      "A free Indian Railway train ticket booking date calculator that helps users find out when their train ticket booking window opens.",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${lexend.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
