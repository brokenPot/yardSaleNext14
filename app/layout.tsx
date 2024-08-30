import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
// import Script from "next/script";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal"],
    variable: "--roboto-text",
});

const rubick = Rubik_Scribble({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
    variable: "--rubick-text",
});

const metallica = localFont({
    src: "./metallica.ttf",
    variable: "--metallica-text",
});

export const metadata: Metadata = {
    title: {
        template: "%s | yard sale",
        default: "yard sale",
    },
    description: "Sell and buy all the things!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${roboto.variable} ${rubick.variable} ${metallica.variable}  bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
      {children}
      </body>
      {/*<Script src="https://developers.kakao.com/sdk/js/kakao.js" async />*/}
      {/*<Script*/}
      {/*    type="text/javascript"*/}
      {/*    src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_KEY}&autoload=false&libraries=services,clusterer`}*/}
      {/*/>*/}
      </html>
  );
}
