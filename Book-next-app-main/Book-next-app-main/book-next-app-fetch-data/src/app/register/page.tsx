"use client";

import AuthService from "../libs/AuthService";
import { RegisterForm } from "@/types/RegisterForm";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Input,
  Stack,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function RegisterPage() {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data: RegisterForm = {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
    };

    const response = await AuthService.Register(data);
    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "/signin";
    } else {
      const err = await response.json();
      alert("Failed to register: " + JSON.stringify(err));
    }
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h5">Register</Typography>
            <Input
              placeholder="Username"
              fullWidth
              onChange={(e) =>
                setRegisterForm({ ...registerForm, username: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              fullWidth
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              type="password"
              fullWidth
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              fullWidth
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value,
                })
              }
            />
            <Button onClick={handleRegister} fullWidth variant="contained">
              Register
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
