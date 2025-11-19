import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.jsoner.app'),
  title: 'JSONer | A minimalist JSON beautifier',
  description: 'JSONer helps to format the input JSON and beautify it to display in a more readable way.',
  openGraph: {
    type: 'website',
    title: 'JSONer | A minimalist JSON beautifier',
    description: 'JSONer helps to format the input JSON and beautify it to display in a more readable way.',
    url: 'https://www.jsoner.app/',
    images: [
      {
        url: '/seo_image.png',
        width: 1024,
        height: 512,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
