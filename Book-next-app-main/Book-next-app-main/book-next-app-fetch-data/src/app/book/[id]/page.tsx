"use client";

import { Book } from "@/types/book";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3000/api/books/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBook(data.book);
      }
    };
    fetchData();
  }, [id]);

  if (!book) return <Container>Loading...</Container>;

  return (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h4">{book.title}</Typography>
        <Typography><strong>Author:</strong> {book.author}</Typography>
        <Typography><strong>Description:</strong> {book.description}</Typography>
        <Typography><strong>Genre:</strong> {book.genre}</Typography>
        <Typography><strong>Year:</strong> {book.year}</Typography>
        <Typography><strong>Price:</strong> ${book.price}</Typography>
        <Typography><strong>Available:</strong> {book.available ? "Yes" : "No"}</Typography>
        <Button variant="contained" onClick={() => router.back()}>
          ⬅ Back
        </Button>
      </Stack>
    </Container>
  );
}
