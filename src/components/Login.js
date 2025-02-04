import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for navigation
import { database } from "../firebase";
import { ref, get, child } from "firebase/database";
import { Toast, ToastContainer } from "react-bootstrap";
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing
import './Login.css'; // Import the CSS file

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        const dbRef = ref(database);

        get(child(dbRef, "users"))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    const user = Object.values(users).find(
                        (user) => user.email === email
                    );

                    if (!user) {
                        setMessage("User not found.");
                    } else {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) {
                                setMessage("Error during password comparison.");
                            } else if (!result) {
                                setMessage("Invalid email or password.");
                            } else {
                                setMessage("Login successful!");
                                setShowToast(true);
                                localStorage.setItem("username", user.username);
                                localStorage.setItem("email", user.email);
                                localStorage.setItem("location", user.location);
                                setTimeout(() => {
                                    navigate("/home");
                                }, 1500);
                            }
                        });
                    }
                } else {
                    setMessage("User not found.");
                }
            })
            .catch((error) => setMessage(error.message));
    };

    return (
        <div
            className="container-fluid d-flex justify-content-center align-items-center vh-100"
        >
            <div
                className="card p-4 shadow-lg"
            >
                <h1 className="text-center mb-4">
                    Login
                </h1>
                {message && (
                    <p
                        className={`alert ${message.includes("successful") ? "alert-success" : "alert-danger"}`}
                        role="alert"
                    >
                        {message}
                    </p>
                )}
                <form onSubmit={handleLogin}>
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
                    <button
                        type="submit"
                        className="btn w-100"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-decoration-none" style={{ color: "tomato" }}>
                            Signup now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Toast Notification */}
            <ToastContainer position="top-center" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Body>Login successful! Redirecting...</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Login;
