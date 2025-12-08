import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import "@/lib/dayjs"; // dayjs 전역 설정 import
import MSWComponent from "@/app/_component/MSWComponent";
import NavigationBar from "@/app/_component/NavigationBar";
import Toast from "@/app/_component/Toast";
import QueryProvider from "@/components/providers/QueryProvider";
import { userApi } from "@/utils/api/user";

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "KNOCK KNOCK 면담 예약 시스템",
  description: "학생과 교수님의 면담 일정을 효율적으로 예약하고 관리하세요.",
};

/**
 * 모든 페이지 공통 레이아웃
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // QueryClient 생성
  const queryClient = new QueryClient();

  // 서버에서 사용자 정보 미리 가져오기 (prefetchQuery 사용)
  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: userApi.getCurrentUser,
    staleTime: 5 * 60 * 1000,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="ko">
      <body className={`${sans.className} bg-gray-100 antialiased`}>
        <QueryProvider>
          <HydrationBoundary state={dehydratedState}>
            <NavigationBar />
            <main>{children}</main>
            <SpeedInsights />
          </HydrationBoundary>
        </QueryProvider>
        <Toast />
        <MSWComponent />
      </body>
    </html>
  );
}
