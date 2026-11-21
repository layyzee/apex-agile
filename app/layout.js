import './globals.css';

export const metadata = {
  title: 'Apex Agile — High-Performance Delivery Platform',
  description: 'Sub-50ms local-first Jira alternative built for Scrum Masters and Agile Delivery Leads',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--bg-canvas)] text-[var(--text-main)] min-h-screen antialiased selection:bg-blue-600/30 selection:text-white font-body">
        {children}
      </body>
    </html>
  );
}
