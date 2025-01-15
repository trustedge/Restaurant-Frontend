import "./globals.css";
import ClientLayout from './client-layout';

export const metadata = {
  title: "Restaurant Management System",
  description: "A comprehensive restaurant management system for handling orders, menu, and settings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
