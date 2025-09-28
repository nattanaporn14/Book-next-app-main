"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Modal,
  Stack,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";

export default function Home() {
  const [booksData, setBooksData] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState<number>(2025);
  const [price, setPrice] = useState<number>(100);
  const [available, setAvailable] = useState(true);

  const router = useRouter();

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooksData(data.books);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setGenre("");
    setYear(2025);
    setPrice(100);
    setAvailable(true);
    setEditingBook(null);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setGenre(book.genre);
    setYear(book.year);
    setPrice(book.price);
    setAvailable(book.available);
    setIsDialogOpen(true);
  };

  const handleSaveBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    const bookData = { title, author, description, genre, year, price, available };

    let res;
    if (editingBook) {
      // Edit existing
      res = await fetch(`http://localhost:3000/api/books/${editingBook._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
    } else {
      // Add new
      res = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
    }

    if (res.ok) {
      const data = await res.json();
      if (editingBook) {
        // update state
        setBooksData((prev) =>
          prev.map((b) => (b._id === editingBook._id ? data.book : b))
        );
      } else {
        setBooksData((prev) => [...prev, data.book]);
      }
      resetForm();
      setIsDialogOpen(false);
    } else {
      alert("Failed to save book");
    }
  };

  const handleDeleteBook = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    const res = await fetch(`http://localhost:3000/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) setBooksData((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <Container maxWidth="md">
      <Stack spacing={2}>
        <Typography variant="h4">Books Application</Typography>
        <Button variant="contained" onClick={openNewDialog}>
          Add New Book
        </Button>

        {isLoading && <Typography>Loading...</Typography>}

        {booksData.map((book) => (
          <Stack
            key={book._id}
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Button
              style={{ flex: 1, justifyContent: "flex-start" }}
              onClick={() => router.push(`/book/${book._id}`)}
            >
              {book.title}
            </Button>

            <IconButton
              color="primary"
              onClick={() => openEditDialog(book)}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => handleDeleteBook(book._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      {/* Modal Add/Edit Book */}
      <Modal open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            width: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6">
              {editingBook ? "Edit Book" : "New Book"}
            </Typography>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              fullWidth
            />
            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
              }
              label="Available"
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveBook}>
                Save
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
}
