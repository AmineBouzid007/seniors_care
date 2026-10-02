import Link from "next/link";
export default function NotFound() {
  return (
    <main className="night grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-display text-7xl font-semibold text-pulse">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">This page doesn't exist</h1>
        <Link href="/" className="mt-8 inline-block rounded-full bg-pulse px-7 py-3 font-semibold text-ink">Back to home</Link>
      </div>
    </main>
  );
}
