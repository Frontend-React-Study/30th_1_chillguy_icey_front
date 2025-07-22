import InfoDialog from "../components/Dialog/InfoDialog";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Invite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
    }
  }, [isLoggedIn, navigate, location]);

  if (!isLoggedIn) return null;

  return (
    <>
      <InfoDialog />
    </>
  );
};

export default Invite;
