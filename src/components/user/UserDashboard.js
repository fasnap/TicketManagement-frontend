import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function UserDashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/user/login");
    }
  }, [user, navigate]);
  return (
    <div>
      <LogoutButton />
      hello{user?.username}
    </div>
  );
}

export default UserDashboard;
