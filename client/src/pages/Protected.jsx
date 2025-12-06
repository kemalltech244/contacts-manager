import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      // decode and check expiration
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        // token expired
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setIsVerified(true);
      }
    } catch (error) {
      // invalid token
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  // while validating, don’t render children yet
  if (!isVerified) return null;

  return <>{children}</>;
};

export default Protected;
