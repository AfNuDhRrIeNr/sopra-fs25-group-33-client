"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering
import "@ant-design/v5-patch-for-react-19";
//import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        ScrabbleNow is in progress
      </h1>
      <main>
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          style={{ display: "block", margin: "0 auto" }}
          priority
        />
      </main>
    </div>
    );
}
