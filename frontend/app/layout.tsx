import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "CampusOR",
  description: "Campus Online Queue & Reservation System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
