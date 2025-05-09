"use client";

import '@ant-design/v5-patch-for-react-19';
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import "./login.css";

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const { set: setUserId } = useLocalStorage<string>("userId", "0");
  const { set: setUsername } = useLocalStorage<string>("username", "");

  const handleRegister = async (values: { username: string; password: string }) => {
    try {
      const response = await apiService.post<User>("/users/register", values, false);
      if (response.token && response.id && response.username) {
        setToken(response.token);
        setUserId(response.id);
        setUsername(response.username);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert(`Registration failed: ${(error as Error).message}`);
    }
  };

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const response = await apiService.post<User>("/users/login", values, false);

      if (response.token && response.id && response.username) {
        setToken(response.token);
        setUserId(response.id);
        setUsername(response.username);
        router.push("/dashboard");
    }} catch (error) {
        console.error("Registration Error:", error);
        alert(`Registration failed: ${(error as Error).message}`);
      }
    };

  return (
    <div
      style={{
        backgroundImage: "url('/BackgroundImageLogin.jpg')",
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
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            const values = {
              username: formData.get("username") as string,
              password: formData.get("password") as string,
            };
            handleLogin(values);
          }}
        >
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
            onClick={() => {
              const form = document.querySelector("form");
              if (form) {
                const formData = new FormData(form);
                const values = {
                  username: formData.get("username") as string,
                  password: formData.get("password") as string,
                };
                handleRegister(values);
              }
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
