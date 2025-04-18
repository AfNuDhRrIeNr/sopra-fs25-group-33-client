import WebSocketClient from "@/ws-testing/WebSocketClient";


export default function Home() {
    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <WebSocketClient />
        </main>
    );
}
