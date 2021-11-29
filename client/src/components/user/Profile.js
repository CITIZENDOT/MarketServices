import React, { useState, useEffect } from "react";

import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  TextField
} from "@mui/material";
import axios from "../../axios";
import { useAuth } from "../../use-auth";
import { ToastContainer, toast } from "react-toastify";
import { toastOptions } from "../../utils";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const { logOut } = useAuth();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/user/profile");
        setProfile(response.data);
      } catch (err) {
        logOut();
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email } = event.target;
    console.log(firstName.value, lastName.value, email.value);
    try {
      const response = await axios.put("/user/profile", {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value
      });
      console.log(response.data);
      toast.success(response.data, toastOptions);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message, toastOptions);
    }
  };

  return profile ? (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 2
      }}
    >
      <ToastContainer />
      <Container
        sx={{
          backgroundImage: `url(${
            require("../../assets/incubation-center-top.jpg").default
          })`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "40vh",
          maxHeight: "50vh",
          maxWidth: "100%"
        }}
      ></Container>

      <Card>
        <CardHeader title="Profile" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="firstName"
                  defaultValue={profile.firstName}
                  fullWidth
                  margin="dense"
                  helperText="First Name"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="lastName"
                  defaultValue={profile.lastName}
                  fullWidth
                  margin="dense"
                  helperText="Last Name"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                defaultValue={profile.email}
                fullWidth
                margin="dense"
                helperText="Email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="userRole"
                defaultValue={profile.userRole}
                fullWidth
                margin="dense"
                helperText="Role"
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>
            <Grid container justifyContent="center">
              <Grid item xs={3}>
                <Button type="submit" fullWidth variant="contained">
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  ) : (
    <p>Loading</p>
  );
}
