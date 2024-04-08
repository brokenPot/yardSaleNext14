import Link from "next/link";

export default function Home() {
  return (
      <div className="flex flex-col items-center justify-between min-h-screen p-6">
        <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
          <span className="text-9xl">🛒</span>
          <h1 className="text-4xl ">Yard Sale</h1>
          <h2 className="text-2xl">welcome to Yard Sale</h2>
        </div>
        <div className="flex flex-col items-center gap-3 w-full">
            <Link href="/create-account" className="primary-btn text-lg py-2.5 bg-blue-500 hover:bg-blue-600 text-white">
            시작하기
          </Link>
          <div className="flex gap-2">
            <span>이미 계정이 있나요?</span>
            <Link href="/login" className="hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
  );
}