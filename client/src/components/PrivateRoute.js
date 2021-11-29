import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../use-auth";

export default function PrivateRoute({ children, userRole, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return user &&
          (userRole
            ? user.userRole === userRole || userRole.includes(user.userRole)
            : true) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
}
