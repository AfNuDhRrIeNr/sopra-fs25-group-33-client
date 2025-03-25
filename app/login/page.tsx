"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { set: setToken } = useLocalStorage<string>("token", "");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await apiService.post<User>("/users", values);
      if (response.token) {
        setToken(response.token);
      }
      router.push("/users");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the login:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/BackgroundImageLogin.jpg')", // Correct absolute path
        backgroundSize: "cover",
        backgroundPosition: "top center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-container">
        <h1>Welcome to ScrabbleNow</h1>
        <p>Who are you?</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="username"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
          <button
            type="button"
            className="login-button"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
