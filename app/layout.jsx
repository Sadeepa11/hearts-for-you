import './globals.css';
import { Inter, Outfit, Playfair_Display } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata = {
  title: 'Sorry Semi | My Princess ❤️',
  description: 'A personalized apology for Semi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/pig.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
