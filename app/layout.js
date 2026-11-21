import './globals.css';

export const metadata = {
  title: 'Apex Agile — High-Performance Delivery Platform',
  description: 'Sub-50ms local-first Jira alternative built for Scrum Masters and Agile Delivery Leads',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#09090b] text-[#f4f4f5] min-h-screen antialiased selection:bg-blue-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
