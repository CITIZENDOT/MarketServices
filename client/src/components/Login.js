import React, { useState } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { Box, Container, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../use-auth";

export default function Login() {
  const { logIn } = useAuth();
  const [successRedirect, setSuccessRedirect] = useState(false);
  const { state } = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target;
    try {
      await logIn(email.value, password.value);
      setSuccessRedirect(true);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    }
  };

  if (successRedirect)
    return (
      <Redirect
        to={{
          pathname: state?.from || "/",
          state: { showAlert: true }
        }}
      />
    );

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 5
      }}
    >
      <h1>Login</h1>
      <ToastContainer />
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
