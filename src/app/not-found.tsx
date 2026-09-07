import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">That slide does not exist.</h1>
      <Link href="/" className="underline underline-offset-4">
        Back to the talk
      </Link>
    </div>
  );
}
