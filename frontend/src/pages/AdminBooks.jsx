import React, { useEffect, useState } from "react";
import BookForm from "../components/BookForm";   // <— REQUIRED IMPORT
import "./AdminBooks.css";

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);

  async function fetchBooks() {
    const res = await fetch("http://localhost:5000/api/books", {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    const data = await res.json();
    setBooks(data);
  }

  useEffect(() => { fetchBooks(); }, []);

  async function createBook(fd) {
    const res = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
      body: fd
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message);
    setCreating(false);
    fetchBooks();
  }

  async function updateBook(id, fd) {
    const res = await fetch("http://localhost:5000/api/books/" + id, {
      method: "PUT",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
      body: fd
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setEditing(null);
    fetchBooks();
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;

    const res = await fetch("http://localhost:5000/api/books/" + id, {
      method: "DELETE",
      headers: { 
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    fetchBooks();
  }

return (
  <div className="admin-books-container">
    <h2 className="admin-books-title">Admin Books</h2>

    {!creating && (
      <button className="add-btn" onClick={() => setCreating(true)}>
        Add New Book
      </button>
    )}

    {creating && <BookForm onSubmit={createBook} />}
    {editing && <BookForm initial={editing} onSubmit={(fd) => updateBook(editing._id, fd)} />}

    <div className="book-list">
      {books.map((b) => (
        <div key={b._id} className="book-card">
          <div className="book-title">{b.title}</div>
          <div className="book-meta">by {b.author}</div>
          <div className="book-meta">File: {b.filePath || "No file uploaded"}</div>

          <button className="btn-edit" onClick={() => setEditing(b)}>Edit</button>
          <button className="btn-delete" onClick={() => deleteBook(b._id)}>Delete</button>

          <hr className="card-line" />
        </div>
      ))}
    </div>
  </div>
);
}
