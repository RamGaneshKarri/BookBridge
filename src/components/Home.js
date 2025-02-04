import React, { useState, useEffect } from "react";
import { database } from "../firebase"; // Firebase
import { ref, onValue } from "firebase/database"; // Firebase functions for reading data
import NavbarComponent from "./Navbar"; // Navbar Component
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "./UserContext"; // Import useUser hook

const Home = () => {
    const username = localStorage.getItem("username");
    const navigate = useNavigate(); // Initialize navigate

    const [books, setBooks] = useState([]); // Books available in the user's location
    const [filteredBooks, setFilteredBooks] = useState([]); // Books filtered by search
    const [loading, setLoading] = useState(true); // Loading state for books

    const { user } = useUser(); // Getting user data from UserContext

    useEffect(() => {
        const booksRef = ref(database, "books/"); // Reference to the books in Firebase
        onValue(booksRef, (snapshot) => {
            const booksData = snapshot.val(); // Get all books data from Firebase
            const filteredBooksList = [];
            const userLocation = user.location?.toLowerCase(); // Get user location

            for (let id in booksData) {
                const book = booksData[id];
                const bookLocation = book.location?.toLowerCase(); // Get book location
                if (bookLocation === userLocation && book.username !== user.username) {
                    filteredBooksList.push({ id, ...book });
                }
            }

            setBooks(filteredBooksList); // Set the filtered books list
            setFilteredBooks(filteredBooksList); // Set the filtered books list for search
            setLoading(false); // Set loading to false after data is loaded
        });
    }, [user]);

    // Function to handle the search functionality
    const handleSearch = (filteredBooks) => {
        setFilteredBooks(filteredBooks); // Update filtered books
    };

    return (
        <>
            <style>
                {`
                     .home-container {
            background-color: #f5f5dc; /* Skin color */
            min-height: 100vh;
            font-family: "Poppins", sans-serif; /* Set Poppins font */
        }

        .welcome-text {
            color: tomato;
            font-size: 1.5rem;
            font-weight: bold;
            font-family: "Poppins", sans-serif; /* Use Poppins */
        }

        .explore-text {
            margin-top: 40px;
            margin-bottom:30px;
            font-size: 1.8rem;
            text-align: center;
            font-family: "Montserrat", sans-serif; /* Use Montserrat */
        }

        .product-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            max-width: 250px;
            margin: 0 auto;
            font-family: "Montserrat", sans-serif; /* Use Montserrat */
        }


                    /* Welcome text with tomato color */
                    

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

            <div className="home-container">
                <NavbarComponent onSearch={handleSearch} /> {/* Navbar Component */}

                <div className="container mt-5">
                    {/* Position Welcome Text Below Navbar */}
                    <div className="welcome-text">
                        Welcome, {username}!
                    </div>

                    {/* Position Explore Books Text Slightly Above and Centered */}
                    <div className="explore-text">
                        Books available in your Locality!
                    </div>

                    {loading ? (
                        <p>Loading books...</p> // Loading state
                    ) : (
                        <div className="card-deck">
                            {filteredBooks.length === 0 ? (
                                <p>No books found!</p> // No books found
                            ) : (
                                filteredBooks.map((book) => (
                                    <div key={book.id} className="product-card col-md-3 mb-4">
                                        <div className="card shadow-sm">
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
                                                <div className="d-flex justify-content-between mt-2">
                                                    <button
                                                        className="btn btn-primary btn-sm chat-btn"
                                                        onClick={() => {
                                                            const chatID = `${book.id}_${username}_${book.username}`;
                                                            navigate(`/chat/${chatID}`, {
                                                                state: {
                                                                    bookID: book.id,
                                                                    buyer: username,
                                                                    seller: book.username,
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        Chat Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
