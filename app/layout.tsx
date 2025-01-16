import "./globals.css";
import ClientLayout from '@/app/client-layout';
import { AdminProvider } from './contexts/admin-context';
import { MenuProvider } from './contexts/menu-context';

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
        <AdminProvider>
          <MenuProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </MenuProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
