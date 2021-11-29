import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import {
  Box,
  Grid,
  Container,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@mui/material";

import axios from "../axios";

export default function Register() {
  const [successRedirect, setSuccessRedirect] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, userRole, firstName, lastName, password } = event.target;
    try {
      const response = await axios.post("/user/register", {
        email: email.value,
        userRole: userRole.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value
      });
      setSuccessRedirect(true);
      document.getElementById("register-form").reset();
    } catch (err) {}
  };

  if (successRedirect) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            severity: "info",
            message: "Your account has been created. You may now login."
          }
        }}
      />
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 5
      }}
    >
      <h1>Register</h1>
      <form onSubmit={handleSubmit} id="register-form">
        <Grid container spacing={2}>
          <Grid item md={6} sm={12}>
            <TextField
              name="firstName"
              fullWidth
              label="First Name"
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item md={6} sm={12}>
            <TextField
              name="lastName"
              fullWidth
              label="Last Name"
              variant="outlined"
              margin="normal"
            />
          </Grid>
        </Grid>
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
          <RadioGroup row name="userRole">
            <FormControlLabel
              value="CUSTOMER"
              control={<Radio />}
              label="Customer"
            />
            <FormControlLabel
              value="SHOPKEEPER"
              control={<Radio />}
              label="Shop Keeper"
            />
          </RadioGroup>
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
            Register
          </Button>
        </Box>
        <Link to="/login">Already Have an account?</Link>
      </form>
    </Container>
  );
}
