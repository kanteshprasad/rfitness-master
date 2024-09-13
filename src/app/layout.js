import { Providers } from './providers.tsx'
import "./globals.css";

export const metadata = {
  title: "Rfitness Management app",
  description: "This is a management app that is under production for rfitness gym management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>
        
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
