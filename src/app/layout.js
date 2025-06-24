import "./globals.css";
import { Inter, Lexend, Poppins } from "next/font/google";
import AppWrapper from "@/Components/layout/AppWrapper";
const inter = Inter({
  subsets: ["sans-serif", "latin"],
  variable: "--font-inter",
});
const lexend = Lexend({
  subsets: ["sans-serif", "latin"],
  variable: "--font-lexend",
});
const poppins = Poppins({
  subsets: ["sans-serif", "latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
}); // Specify weights if needed

export const metadata = {
  title: "PharmaHub",
  description: "Default description for all pages",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lexend.variable} ${poppins.variable}  vsc-initialized overflow-hidden min-h-screen antialiased`}
      >
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
