import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Muse - Artist Empowerment Platform',
  description: 'A global sanctuary where creativity rises, cultures thrive, and independent artists become unstoppable forces of change.',
  keywords: 'artists, social media, crowdfunding, collaboration, creatives, cultural heritage',
  authors: [{ name: 'Muse Team' }],
  openGraph: {
    title: 'Muse - Artist Empowerment Platform',
    description: 'Empowering independent artists and creatives globally',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
} 