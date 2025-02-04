import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Dropdown, Badge } from "react-bootstrap";
import { ref, onValue, set } from "firebase/database";
import { database } from "../firebase";

const NavbarComponent = ({ onSearch, userBooks = [], userID }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [showNoBooksMessage, setShowNoBooksMessage] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/home") {
            const booksRef = ref(database, "books/");
            onValue(booksRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const bookList = Object.values(data);
                    setBooks(bookList);
                    setFilteredBooks(bookList); // Initially show all books
                }
            });
        }
    }, [location.pathname]);

    useEffect(() => {
        const notificationsRef = ref(database, `notifications/${userID}`);
        onValue(notificationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const notificationsArray = Object.entries(data).map(([id, value]) => ({
                    id,
                    ...value,
                }));
                setNotifications(notificationsArray);
            } else {
                setNotifications([]);
            }
        });
    }, [userID]);

    const handleNotificationClick = (notification) => {
        navigate("/chat-room", { state: { buyer: notification.buyerID, seller: userID } });

        const notificationRef = ref(database, `notifications/${userID}/${notification.id}`);
        set(notificationRef, null); // Clear the notification
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        let filtered = [];
        if (location.pathname === "/home") {
            filtered = books.filter((book) =>
                book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
            );
        } else if (location.pathname === "/my-uploads") {
            filtered = userBooks.filter((book) =>
                book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
            );
        }

        setFilteredBooks(filtered);
        setShowNoBooksMessage(false); // Do not handle the message here

        if (onSearch) {
            onSearch(filtered);
        }
    };

    return (
        <div>
            <style>
                {`
        body {
            font-family: 'Poppins', sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Montserrat', sans-serif;
        }
        .nav-item {
            color: black;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.3s ease;
        }
        .nav-item:hover {
            color: tomato;
        }
        .brand-title {
            font-family: 'Dancing Script', cursive;
            font-size: 2rem;
            color: tomato;
            transition: transform 0.3s ease, color 0.3s ease;
        }
        .brand-title:hover {
            color: tomato;
        }
        .bi-bell {
            color: black; /* Set initial color to black */
        }
        .bi-bell:hover {
            color: tomato; /* Change color to tomato when hovered */
        }
        .bi-bell, .bi-person-circle {
            font-size: 1.5rem;
        }
        .bi-person-circle:hover {
            color: tomato;
        }
        .no-books-message {
            text-align: center;
            color: gray;
            font-size: 1.2rem;
            margin-top: 20px;
        }
    `}
            </style>

            <Navbar expand="lg" bg="light" variant="light" className="shadow-sm navbar-light">
                <div className="container">
                    <Navbar.Brand as={Link} to="/home" className="brand-title">
                        BookBridge
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="ms-auto">
                            {(location.pathname === "/home" || location.pathname === "/my-uploads") && (
                                <Form className="d-flex">
                                    <FormControl
                                        type="search"
                                        placeholder="Search Books"
                                        className="me-2"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </Form>
                            )}

                            <Nav.Link as={Link} to="/home" className="nav-item">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/upload-book" className="nav-item">
                                Upload Book
                            </Nav.Link>
                            <Nav.Link as={Link} to="/my-uploads" className="nav-item">
                                My Uploads
                            </Nav.Link>
                            <Nav.Link as={Link} to="/about-us" className="nav-item">
                                About Us
                            </Nav.Link>

                            <Dropdown align="end" className="me-3">
                                <Dropdown.Toggle
                                    variant="light"
                                    id="dropdown-basic"
                                    className="position-relative"
                                    style={{ border: 'none', background: 'none' }}
                                >
                                    <i className="bi bi-bell"></i>
                                    {notifications.length > 0 && (
                                        <Badge
                                            bg="danger"
                                            pill
                                            className="position-absolute top-0 start-100 translate-middle"
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            {notifications.length}
                                        </Badge>
                                    )}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {notifications.length === 0 ? (
                                        <Dropdown.Item disabled>No new messages</Dropdown.Item>
                                    ) : (
                                        notifications.map((notification) => (
                                            <Dropdown.Item
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                Message from {notification.buyerName}
                                            </Dropdown.Item>
                                        ))
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>

                             
                                <Dropdown.Menu>
                                    {notifications.length === 0 ? (
                                        <Dropdown.Item disabled>No new messages</Dropdown.Item>
                                    ) : (
                                        notifications.map((notification) => (
                                            <Dropdown.Item
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                Message from {notification.buyerName}
                                            </Dropdown.Item>
                                        ))
                                    )}
                                </Dropdown.Menu>
                           

                            <Nav.Link as={Link} to="/profile" className="nav-item">
                                <i className="bi bi-person-circle" style={{ fontSize: "1.5rem" }}></i>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </div>
            </Navbar>
            {showNoBooksMessage && (
                <div className="no-books-message">
                    No books found with your specified match.
                </div>
            )}
        </div>
    );
};

export default NavbarComponent;
