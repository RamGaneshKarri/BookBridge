import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, update } from "firebase/database"; // Firebase functions
import { database } from "../firebase"; // Firebase
import NavbarComponent from "./Navbar"; // Navbar Component
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import { useUser } from "./UserContext";

const Profile = () => {
    const [bookCount, setBookCount] = useState(0); // Number of books uploaded
    const [editField, setEditField] = useState(""); // Field being edited (username or location)
    const [newFieldValue, setNewFieldValue] = useState(""); // New value for the field being edited
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const location = localStorage.getItem("location");

    useEffect(() => {
        if (!username) {
            navigate("/login"); // Redirect to login if not logged in
        } else {
            // Fetch user's uploaded books count from Firebase
            const booksRef = ref(database, "books/");
            onValue(booksRef, (snapshot) => {
                const books = snapshot.val();
                let count = 0;
                for (let id in books) {
                    if (books[id].username === username) {
                        count++;
                    }
                }
                setBookCount(count);
            });
        }
    }, [navigate, username]);

    // Handle Logout
    const handleLogout = () => {
        localStorage.clear(); // Clear user data
        toast.success("Logged out successfully!");
        navigate("/login"); // Redirect to login page
    };

    // Handle field edit
    const handleEdit = (field) => {
        setEditField(field); // Set the field being edited
        setNewFieldValue(field === "username" ? username : location); // Set the current value of the field
    };

    // Save updated field
    const { user, updateUser } = useUser();

    const saveField = () => {
        const updates = {};
        updates[`/users/${user.username}/${editField}`] = newFieldValue.toLowerCase(); // Firebase update
        const usersRef = ref(database, `users/${user.username}`);

        update(usersRef, { [editField]: newFieldValue.toLowerCase() })
            .then(() => {
                updateUser({ [editField]: newFieldValue.toLowerCase() });
                toast.success(`${editField.charAt(0).toUpperCase() + editField.slice(1)} updated successfully!`);
                setEditField("");
            })
            .catch((error) => {
                toast.error("Error updating field: " + error.message);
            });
    };

    return (
        <div style={{ backgroundColor: "#f5f5dd", minHeight: "100vh", fontFamily: 'Poppins, sans-serif' }}> {/* Apply skin color and make sure it covers the full height */}
            <NavbarComponent /> {/* Navbar included */}
            <div className="container mt-5">
                <div className="card mx-auto" style={{ maxWidth: "400px", textAlign: "center" }}>
                    <div className="card-body">
                        <i
                            className="bi bi-person-circle"
                            style={{ fontSize: "100px", color: "gray" }}
                        ></i>
                        <h2 className="card-title mt-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Profile</h2>
                        <div className="mt-4">
                            {/* Username */}
                            <p>
                                <strong>Username:</strong> {username}
                            </p>

                            {/* Email */}
                            <p><strong>Email:</strong> {email}</p>

                            {/* Location */}
                            <p>
                                <strong>Location:</strong>{" "}
                                {editField === "location" ? (
                                    <input
                                        type="text"
                                        value={newFieldValue}
                                        onChange={(e) => setNewFieldValue(e.target.value)}
                                        className="form-control"
                                    />
                                ) : (
                                    location
                                )}{" "}
                                <i
                                    className="bi bi-pencil-square text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleEdit("location")}
                                ></i>
                            </p>

                            {/* No. of Books Uploaded */}
                            <p><strong>No. of Books Uploaded:</strong> {bookCount}</p>
                        </div>

                        {/* Save Button */}
                        {editField && (
                            <button
                                className="btn btn-success mt-2"
                                onClick={saveField}
                            >
                                Save
                            </button>
                        )}

                        {/* Logout Button */}
                        <button
                            className="btn btn-danger mt-4"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer /> {/* Toast notifications container */}
        </div>
    );
};

export default Profile;
