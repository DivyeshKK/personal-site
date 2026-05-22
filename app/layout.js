import "./globals.css";

export const metadata = {
  title: "Divyesh Khatri",
  description: "Personal website — under construction.",
  openGraph: {
    title: "Divyesh Khatri",
    description: "Personal website — under construction.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
