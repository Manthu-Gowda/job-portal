// src/hooks/useAutoLogout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 15 * 60 * 1000;

const useAutoLogout = () => {
  const navigate = useNavigate();
  const userRolesString = sessionStorage.getItem("userRoles");
  const userRoles = userRolesString ? JSON.parse(userRolesString) : null;
  const superAdmin = userRoles?.userId

  useEffect(() => {
    const updateActivity = () => {
      sessionStorage.setItem("lastActivity", Date.now().toString());
    };

    const checkInactivity = () => {
      const lastActivity = parseInt(
        sessionStorage.getItem("lastActivity") || "0"
      );
      const now = Date.now();

      if (now - lastActivity > INACTIVITY_LIMIT) {
        sessionStorage.clear();
        if (superAdmin === 1) {
          navigate("/admin-login");
        } else {
          navigate("/");
        }
      }
    };

    ["mousemove", "keydown", "mousedown", "scroll", "touchstart"].forEach(
      (event) => window.addEventListener(event, updateActivity)
    );

    updateActivity();
    const interval = setInterval(checkInactivity, 10000);

    return () => {
      ["mousemove", "keydown", "mousedown", "scroll", "touchstart"].forEach(
        (event) => window.removeEventListener(event, updateActivity)
      );
      clearInterval(interval);
    };
  }, [navigate]);
};

export default useAutoLogout;
