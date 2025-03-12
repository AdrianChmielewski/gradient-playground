import '../styles/globals.css';
import Link from 'next/link';
import ThemeSelector from '../components/ThemeSelector';
import { Inter } from 'next/font/google';

// Import czcionki Inter
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

/**
 * Globalne metadane SEO - używane przez Next.js Metadata API
 */
export const metadata = {
  title: "Interaktywny Gradient Studio",
  description: "Nowoczesny kreator gradientów, galeria presetów oraz zaawansowane efekty wizualne.",
  keywords: "gradient, css, generator, kreator, design, kolory, webdesign",
};

/**
 * Główny layout aplikacji.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${inter.variable} scroll-smooth`}>
      <head />
      <body className="min-h-screen bg-base-100 text-base-content transition-colors flex flex-col font-sans">
        <header className="sticky top-0 z-50">
          <nav className="navbar bg-base-200 shadow-md backdrop-blur-md bg-opacity-90">
            <div className="navbar-start">
              {/* Menu mobilne */}
              <div className="dropdown lg:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link href="/">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                      Kreator gradientów
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Galeria
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Logo i tytuł */}
              <Link href="/" className="btn btn-ghost normal-case text-xl font-bold flex items-center gap-2">
                <div className="relative w-8 h-8 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent"></div>
                </div>
                <span className="hidden sm:inline">Gradient Studio</span>
              </Link>
            </div>
            
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link href="/" className="btn btn-ghost gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                    Kreator
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="btn btn-ghost gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Galeria
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="navbar-end">
              {/* Komponent wyboru motywu */}
              <ThemeSelector />
              
              {/* GitHub link */}
              <a href="https://github.com/AdrianChmielewski/gradient-playground" className="btn btn-ghost btn-circle" target="_blank" rel="noopener noreferrer" aria-label="Repozytorium GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow py-6 px-4 lg:py-8 lg:px-6">{children}</main>
        
        <footer className="bg-base-200 text-base-content">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent"></div>
                  </div>
                  <h2 className="text-xl font-bold">Gradient Studio</h2>
                </div>
                <p className="text-base-content/80">
                  Nowoczesne narzędzie do tworzenia pięknych gradientów dla stron internetowych, aplikacji i projektów graficznych.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Nawigacja</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="hover:text-primary transition-colors">Kreator gradientów</Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="hover:text-primary transition-colors">Galeria presetów</Link>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold">O projekcie</h3>
                <p className="text-base-content/80">
                  Narzędzie służące do tworzenia gradientów z eksportem do CSS i SVG.
                </p>
                <div className="text-base-content/80">
                  <p>Twórcy:</p>
                  <ul className="list-disc list-inside">
                    <li>Adrian Chmielewski</li>
                    <li>Maksymilian Pasikowski</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-base-300 mt-8 pt-6 text-center text-base-content/60">
              <p>© {new Date().getFullYear()} Gradient Studio. Autorzy: Adrian Chmielewski, Maksymilian Pasikowski. Wszelkie prawa zastrzeżone.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
