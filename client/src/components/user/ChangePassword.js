import React, { useState } from "react";

import axios from "../../axios";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function ChangePassword() {
  const [alert, setAlert] = useState({
    severity: null,
    message: null
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword } = event.target;

    try {
      const response = await axios.post("/user/change-password", {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      setAlert({
        severity: "info",
        message: response.data.message
      });
    } catch (err) {
      setAlert({
        severity: "error",
        message: err.response.data.message
      });
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 5
      }}
    >
      <h1>Change Password</h1>
      {alert.message && (
        <Alert severity={alert.severity}>{alert.message}</Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            name="currentPassword"
            type="password"
            fullWidth
            label="Current Password"
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box>
          <TextField
            name="newPassword"
            type="password"
            fullWidth
            label="New Password"
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box>
          <Button type="submit" variant="contained" fullWidth>
            Change Password
          </Button>
        </Box>
      </form>
    </Container>
  );
}
