import "./globals.css";
import { space_grotesk } from "./lib/fonts";

export const metadata = {
  title: "QR Code Generator",
  description: "Online QR Code Generator by Shah Samin Yasar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${space_grotesk.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
