import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "HaloPadel - Sân Thể Thao Chuyên Nghiệp",
    template: "%s | HaloPadel",
  },
  description:
    "Sân thể thao HaloPadel - Không gian tập luyện đẳng cấp, tiện nghi hiện đại. Liên hệ ngay để trải nghiệm!",
  keywords: ["sân padel", "sân thể thao", "padel court", "thể thao"],
  authors: [{ name: "HaloPadel" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "HaloPadel",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
