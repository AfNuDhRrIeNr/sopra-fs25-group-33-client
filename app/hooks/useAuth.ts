import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true); // User is authenticated
    }
    setIsFetching(false); // Authentication check is complete
  }, [router]);

  return { isAuthenticated, isFetching };
};

export default useAuth;
