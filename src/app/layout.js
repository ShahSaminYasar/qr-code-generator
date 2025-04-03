import "./globals.css";
import { space_grotesk } from "./lib/fonts";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "QR Code Generator",
  description: "Fast and easy online QR Code Generator by Shah Samin Yasar",
  keywords: [
    "qr code generator",
    "online qr code generator",
    "free qr code generator online",
    "link to qr code",
    "free qr generator online",
  ],
  robots: "index, follow",
  authors: [{ name: "Shah Samin Yasar" }],
  metadataBase: new URL("https://ssy-qrcodegenerator.vercel.app"),
  openGraph: {
    title: "QR Code Generator",
    description: "Fast and easy online QR Code Generator by Shah Samin Yasar",
    url: "https://ssy-qrcodegenerator.vercel.app",
    siteName: "QR Code Generator",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Online QR Code Generator by Shah Samin Yasar",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${space_grotesk.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
