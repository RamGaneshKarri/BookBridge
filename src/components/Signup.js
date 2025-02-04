import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { database } from "../firebase";
import { ref, get, child, set } from "firebase/database";
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        const dbRef = ref(database);

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                setMessage("Error hashing password.");
                return;
            }

            get(child(dbRef, "users"))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const users = snapshot.val();
                        const isEmailExists = Object.values(users).some(
                            (user) => user.email === email
                        );
                        if (isEmailExists) {
                            setMessage("Email is already registered!");
                            return;
                        }
                    }
                    const userId = new Date().getTime();
                    set(ref(database, "users/" + userId), {
                        username,
                        email,
                        password: hashedPassword,
                        location: location.toLowerCase(), // Convert to lowercase
                    })
                        .then(() => {
                            localStorage.setItem("username", username);
                            localStorage.setItem("email", email);
                            localStorage.setItem("location", location.toLowerCase()); // Convert to lowercase
                            setMessage("Signup successful!");
                            navigate("/login");
                        })
                        .catch((error) => setMessage(error.message));
                })
                .catch((error) => setMessage(error.message));
        });
    };

    return (
        <div className="signup-page" style={{ backgroundColor: "#f5f5dc", fontFamily: "Poppins, sans-serif" }}>
            <div
                className="container d-flex justify-content-center align-items-center vh-100"
                style={{
                    maxWidth: "400px",
                    borderRadius: "10px",
                }}
            >
                <div className="card p-4 shadow-lg" style={{ width: "100%" }}>
                    <h1 className="text-center mb-4" style={{ color: "tomato", fontFamily: "Montserrat, sans-serif" }}>
                        Signup
                    </h1>
                    {message && (
                        <p
                            className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"}`}
                            role="alert"
                        >
                            {message}
                        </p>
                    )}
                    <form onSubmit={handleSignup}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-100"
                            style={{
                                backgroundColor: "tomato",
                                color: "#fff",
                                border: "none",
                            }}
                        >
                            Signup
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="text-decoration-none" style={{ color: "tomato" }}>
                                Login Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
