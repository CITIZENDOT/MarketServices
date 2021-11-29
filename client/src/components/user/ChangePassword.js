import React from "react";
import axios from "../../axios";
import { Box, Container, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../../utils";

export default function ChangePassword() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const { currentPassword, newPassword } = event.target;

    try {
      const response = await axios.post("/user/change-password", {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      toast.success(response.data.message, toastOptions);
    } catch (err) {
      toast.error(err.response.data.message, toastOptions);
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
      <ToastContainer />
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
