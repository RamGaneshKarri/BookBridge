import React from "react";
import { Link } from "react-router-dom";
import "./GetStarted.css";

const GetStarted = () => {
    return (
        <div className="get-started-container d-flex align-items-center justify-content-center">
            <div className="text-container p-4 shadow">
                <h1 className="typing-effect">Welcome to BookBridge</h1>
                <p>
                    BookBridge connects students within the same locality to exchange used books at affordable prices, making education more accessible and sustainable.
                </p>
                <Link to="/signup">
                    <button className="btn get-started-btn btn-lg mt-3">
                        Let's Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default GetStarted;
