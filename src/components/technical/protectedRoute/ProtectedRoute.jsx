import { Route } from "wouter";

import style from "./ProtectedRoute.Style";
import { useEffect } from "react";

function ProtectedRoute({ isAuthenticated, navigate, ...rest }) {
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/session" });
    }
  }, [isAuthenticated]);

  return isAuthenticated && <Route {...rest} />;
}

export default style(ProtectedRoute);
