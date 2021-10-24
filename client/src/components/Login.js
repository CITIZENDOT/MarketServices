import React, { useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAuth } from "../use-auth";

export default function Login() {
  const { logIn } = useAuth();
  const [successRedirect, setSuccessRedirect] = useState(false);
  const { state } = useLocation();

  const [alert, setAlert] = useState({
    severity: state ? state.severity : null,
    message: state ? state.message : null
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    try {
      const response = await logIn(email.value, password.value);
      setSuccessRedirect(true);
    } catch (err) {
      console.log(err.response);
      setAlert({
        severity: "error",
        message: err.response.data.message
      });
    }
  };

  if (successRedirect) return <Redirect to={state?.from || "/"} />;

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 5
      }}
    >
      <h1>Login</h1>
      {alert.message && (
        <Alert severity={alert.severity}>{alert.message}</Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            name="email"
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            name="password"
            type="password"
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
        <Link to="/register">Don't have account?</Link>
      </form>
    </Container>
  );
}
