import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AfterMe — feel ready before you go", description: "A simulated Alexa+ travel-planning experience that gets your home and trip ready." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
