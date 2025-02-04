import React from "react";
import NavbarComponent from "./Navbar";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutUs = () => {
    return (
        <div style={{ backgroundColor: "#f5f5dc", minHeight: "100vh" }}>
            {/* Internal CSS for custom styles */}
            <style>
                {`
                    body {
                        background-color: #f5f5dc; /* Skin-colored background */
                        font-family: 'Poppins', sans-serif; /* Apply Poppins font globally */
                    }

                    .about-us-header {
                        font-family: 'Montserrat', sans-serif;
                        font-size: 2.5rem;
                        color: tomato;
                        text-align: center;
                        margin-top: 2rem;
                        margin-bottom: 1.5rem;
                    }

                    .section-header {
                        font-family: 'Montserrat', sans-serif;
                        font-size: 1.8rem;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 1rem;
                    }

                    .section-content {
                        font-family: 'Poppins', sans-serif;
                        font-size: 1.1rem;
                        color: #555;
                        line-height: 1.8;
                        margin-bottom: 2rem;
                    }

                    .footer {
                        background-color: #f8f9fa;
                        padding: 1.5rem 0;
                        text-align: center;
                        margin-top: 2rem;
                    }

                    .footer .social-icons a {
                        font-size: 1.5rem;
                        color: #333;
                        margin: 0 10px;
                        transition: color 0.3s;
                    }

                    .footer .social-icons a:hover {
                        color: tomato;
                    }

                    .card-custom {
                        max-width: 800px;
                        margin: auto;
                        background-color: #fff;
                        border-radius: 10px;
                    }
                `}
            </style>

            {/* Reusing Navbar Component */}
            <NavbarComponent />

            {/* About Us Section */}
            <Container>
                <h1 className="about-us-header">About BookBridge</h1>

                <Row className="mb-5">
                    <Col>
                        <Card className="shadow-sm border-0 card-custom">
                            <Card.Body>
                                <h2 className="section-header">Why We Started</h2>
                                <p className="section-content">
                                    BookBridge was created to solve the challenge of high educational resource costs. Many students struggle to afford new books every year, and numerous books go unused at home. We aim to connect students within the same locality to exchange reused books at lower costs, making education more accessible.
                                </p>
                                <p className="section-content">
                                    Our platform promotes sustainability, reduces waste, and helps build a community of learners supporting one another.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Contact Us Section */}
                <Row>
                    <Col>
                        <Card className="shadow-sm border-0 card-custom">
                            <Card.Body>
                                <h2 className="section-header">Contact Us</h2>
                                <p className="section-content">
                                    Have questions or suggestions? We'd love to hear from you! Feel free to reach out to
                                    us through any of the channels below.
                                </p>
                                <p className="section-content">
                                    <strong>Email:</strong> ramganeshkarri7@gmail.com<br />
                                    <strong>Phone:</strong> +91 8374547299<br />
                                    <strong>Address:</strong> Vishnu Institute of Technology, Bhimavaram
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Footer Section */}
            <footer className="footer" style={{ backgroundColor: "#f5f5dc" }}>
                <Container>
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-twitter"></i>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="bi bi-linkedin"></i>
                        </a>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default AboutUs;
