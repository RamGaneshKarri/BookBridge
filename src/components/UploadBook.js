import React, { useState } from "react";
import { database } from "../firebase"; // Firebase
import { ref, set } from "firebase/database"; // Firebase functions for writing data
import NavbarComponent from "./Navbar"; // Navbar Component
import { toast, ToastContainer } from "react-toastify"; // Import Toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

const UploadBook = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [cost, setCost] = useState("");
    const [condition, setCondition] = useState("Good");
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = (e) => {
        e.preventDefault();
        const bookData = {
            title,
            author,
            condition,
            cost,
            location: localStorage.getItem("location")?.toLowerCase(), // Normalize location
            username: localStorage.getItem("username"),
        };

        const bookId = new Date().getTime();
        set(ref(database, "books/" + bookId), bookData)
            .then(() => {
                toast.success("Book uploaded successfully!");

                // Clear the form after successful upload
                setTitle("");
                setAuthor("");
                setCost("");
                setCondition("Good");
                setImageUrl(""); // Clear image URL
            })
            .catch((error) => {
                toast.error(`Error: ${error.message}`);
            });
    };

    return (
        <div style={{ backgroundColor: "#f5f5dc", minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}>
            <NavbarComponent /> {/* Navbar included */}

            <div className="container mt-5">
                <div className="card p-4 shadow-lg border" style={{ maxWidth: "600px", margin: "auto" }}>
                    <h2 style={{ fontFamily: "Montserrat, sans-serif" }}>Upload a Book</h2>
                    <form onSubmit={handleUpload}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Book Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="author" className="form-label">Author</label>
                            <input
                                type="text"
                                className="form-control"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cost" className="form-label">Cost</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cost"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="condition" className="form-label">Condition</label>
                            <select
                                id="condition"
                                className="form-select"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
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
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn"
                            style={{ backgroundColor: "#ff6347", color: "white" }}
                        >
                            Upload
                        </button>
                    </form>
                </div>
            </div>

            {/* ToastContainer where all toast notifications will be displayed */}
            <ToastContainer
                style={{
                    marginTop: "80px", // Adjust this based on the height of your navbar
                    zIndex: 1050, // Ensure the toast appears above other content but below the navbar
                }}
            />
        </div>
    );
};

export default UploadBook;
