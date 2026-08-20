import "./globals.css";
import { ThemeProvider } from "../components/theme/ThemeProvider";

export const metadata = {
  title: "Taskora",
  description: "Simple task and project management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}