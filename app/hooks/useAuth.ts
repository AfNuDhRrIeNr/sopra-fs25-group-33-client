import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/"); // Redirect to login if no token is found
        } else {
            setIsAuthenticated(true); // User is authenticated
        }
        setIsLoading(false); // Authentication check is complete
    }, [router]);

    return { isAuthenticated, isLoading };
};

export default useAuth;