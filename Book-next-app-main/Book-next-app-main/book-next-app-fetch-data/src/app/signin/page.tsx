"use client";

import AuthService from "../libs/AuthService";
import { useState } from "react";
import { Container, Box, Input, Button, Stack, Typography } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await AuthService.Login(email, password);
    if (res.ok) {
      const data = await res.json();
      // Save token in localStorage
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "/"; // redirect to home
    } else {
      const err = await res.json();
      alert("Login failed: " + JSON.stringify(err));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Stack spacing={2}>
          <Typography variant="h5">Login</Typography>
          <Input
            placeholder="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" fullWidth onClick={handleLogin}>
            Login
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
