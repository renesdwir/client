"use client";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <header className="w-full">
      <nav>
        <ul className="flex items-center justify-between border-b ">
          <li>
            <a
              href="/"
              rel="noopener noreferrer"
              className="pointer-even-none flex place-items-center gap-2 py-8 "
            >
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className="dark:invert"
                width={100}
                height={24}
                priority
              />
            </a>
          </li>
          <li>
            <div className="flex place-items-center gap-x-16">
              <Link href={"/"}>Cars</Link>
              <Link href={"/orders"}>Orders</Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
