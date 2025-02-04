import React, { useState, useEffect } from "react";
import { database } from "../firebase"; // Firebase
import { ref, onValue, remove, update } from "firebase/database"; // Firebase functions
import NavbarComponent from "./Navbar"; // Navbar Component
import { useNavigate } from "react-router-dom"; // Navigation hook
import { toast, ToastContainer } from "react-toastify"; // Import Toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

const MyUploads = () => {
    const [userBooks, setUserBooks] = useState([]); // Books uploaded by the user
    const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books based on search query
    const [selectedBook, setSelectedBook] = useState(null); // Book selected for editing
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete confirmation modal visibility
    const [bookToDelete, setBookToDelete] = useState(null); // Book to delete
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) {
            navigate("/login"); // Redirect to login if the user is not logged in
        } else {
            // Fetch books uploaded by the user from Firebase
            const booksRef = ref(database, "books/");
            onValue(booksRef, (snapshot) => {
                const books = snapshot.val();
                const filteredBooks = [];
                for (let id in books) {
                    if (books[id].username === username) {
                        filteredBooks.push({ id, ...books[id] });
                    }
                }
                setUserBooks(filteredBooks);
                setFilteredBooks(filteredBooks); // Initially, show all user books
            });
        }
    }, [navigate]);

    // Handle search input from Navbar
    const handleSearch = (books) => {
        setFilteredBooks(books);
    };

    // Handle book deletion - Open the delete confirmation modal
    const handleDelete = (book) => {
        setBookToDelete(book); // Store the book to delete
        setIsDeleteModalOpen(true); // Show the delete confirmation modal
    };

    // Confirm book deletion
    const confirmDelete = () => {
        const bookRef = ref(database, "books/" + bookToDelete.id);
        remove(bookRef)
            .then(() => {
                // Remove the book from the state array after deletion
                setUserBooks(userBooks.filter((book) => book.id !== bookToDelete.id));
                // Show success toast message after deletion
                toast.success("Book deleted successfully!");
                setIsDeleteModalOpen(false); // Close the delete confirmation modal
            })
            .catch((error) => toast.error("Error deleting book: " + error.message));
    };

    // Cancel deletion
    const cancelDelete = () => {
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
        setBookToDelete(null); // Clear the book to delete
    };

    // Handle book editing (open modal)
    const handleEdit = (book) => {
        setSelectedBook(book); // Set the selected book for editing
        setIsModalOpen(true); // Open the modal
    };

    // Handle modal close
    const closeModal = () => {
        setSelectedBook(null); // Clear the selected book
        setIsModalOpen(false); // Close the modal
    };

    // Handle form submission for editing
    const handleUpdate = (e) => {
        e.preventDefault();

        const bookRef = ref(database, "books/" + selectedBook.id);
        update(bookRef, selectedBook)
            .then(() => {
                // Update the book in the state
                setUserBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === selectedBook.id ? selectedBook : book
                    )
                );

                // Show success toast message
                toast.success("Book updated successfully!");
                closeModal(); // Close the modal
            })
            .catch((error) => toast.error("Error updating book: " + error.message));
    };

    // Handle input change in the modal form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedBook((prevBook) => ({
            ...prevBook,
            [name]: value,
        }));
    };

    return (
        <div style={{ backgroundColor: "#f5f5dc", minHeight: "100vh" }}>
            <NavbarComponent onSearch={handleSearch} userBooks={userBooks} /> {/* Pass handleSearch to Navbar */}

            <div className="container mt-5">
                <h2 style={{ color: "tomato" }}>My Uploaded Books</h2>

                <div className="row">
                    {filteredBooks.length === 0 ? (
                        <p>No books found.</p>
                    ) : (
                        filteredBooks.map((book) => (
                            <div key={book.id} className="col-md-4">
                                <div className="product-card mb-4 shadow-sm">
                                    <div className="card">
                                        <img
                                            src={book.imageUrl || "https://via.placeholder.com/150"}
                                            alt={book.title}
                                            className="card-img-top"
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{book.title}</h5>
                                            <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                            <p className="card-text"><strong>Cost:</strong> ₹{book.cost}</p>
                                            <p className="card-text"><strong>Condition:</strong> {book.condition}</p>
                                            <div className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleEdit(book)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(book)} // Trigger delete modal
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModalOpen && (
                <div
                    className="modal"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={cancelDelete} // Close the modal
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this book?</p>
                                <div className="d-flex justify-content-end">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={cancelDelete} // Cancel deletion
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-danger ml-2"
                                        onClick={confirmDelete} // Confirm deletion
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for editing book details */}
            {isModalOpen && (
                <div
                    className="modal"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Book Details</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Book Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={selectedBook.title || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="author" className="form-label">Author</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="author"
                                            name="author"
                                            value={selectedBook.author || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cost" className="form-label">Cost</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="cost"
                                            name="cost"
                                            value={selectedBook.cost || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="condition" className="form-label">Condition</label>
                                        <select
                                            id="condition"
                                            name="condition"
                                            className="form-select"
                                            value={selectedBook.condition || "Good"}
                                            onChange={handleChange}
                                        >
                                            <option value="Good">Good</option>
                                            <option value="Ok">Ok</option>
                                            <option value="New">New</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="imageUrl" className="form-label">Image URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="imageUrl"
                                            name="imageUrl"
                                            value={selectedBook.imageUrl || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">Update</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ToastContainer where all toast notifications will be displayed */}
            <ToastContainer
                style={{
                    marginTop: "80px", // Adjust this based on the height of your navbar
                    zIndex: 1050, // Ensure the toast appears above other content but below the navbar
                }}
            />

            {/* Apply fonts */}
            <style>
                {`
                    body {
                        font-family: 'Poppins', sans-serif;
                    }
                    h1, h2, h3, h4, h5, h6 {
                        font-family: 'Montserrat', sans-serif;
                    }
                    .product-card {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        height: 90%;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        max-width: 250px; /* Set a max-width for larger screens */
                        margin: 0 auto;
                    }

                    .product-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    }

                    .card-img-top {
                        height: 200px;
                        object-fit: cover;
                    }

                    .card-body {
                        padding: 15px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    .card-title {
                        font-size: 1.1rem;
                    }

                    .card-text {
                        font-size: 0.85rem;
                    }

                    .chat-btn {
                        font-size: 0.9rem;
                        padding: 5px 10px;
                    }

                    /* Responsive design for product cards */
                    @media (max-width: 1200px) {
                        .product-card {
                            width: calc(33.33% - 20px); /* Three cards per row */
                        }
                    }

                    @media (max-width: 768px) {
                        .product-card {
                            width: calc(50% - 20px); /* Two cards per row */
                        }
                    }

                    @media (max-width: 576px) {
                        .product-card {
                            width: 100%; /* One card per row */
                        }
                    }

                    .card-deck {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        justify-content: center;
                    }
                `}
            </style>
        </div>
    );
};

export default MyUploads;
