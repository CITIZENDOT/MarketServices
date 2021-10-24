import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "../../axios";
import { useAuth } from "../../use-auth";

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

  return profile ? (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: 2
      }}
    >
      <Card>
        <CardHeader title="Profile" />
        <CardContent>
          <Typography>{`Email: ${profile.email}`}</Typography>
          <Typography>{`Name: ${profile.firstName} ${profile.lastName}`}</Typography>
          <Typography>{`Role: ${profile.userRole}`}</Typography>
        </CardContent>
      </Card>
    </Container>
  ) : (
    <p>Loading</p>
  );
}
