import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
const PublicRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuthContext();
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        return !user ? <Component {...routeProps} /> : <Navigate to="/" />;
      }}
    />
  );
};

export default PublicRoute;
