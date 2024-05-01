import React from 'react';
import './AboutUs.css'; // Import your CSS file for styling

const AboutUs: React.FC = () => {
    return (
        <div className="about-us-container">
            <h1>About Us</h1>
            <div className="about-us-content">
                <h1>Cheese Bank</h1>
                <p>Welcome to XYZ Bank, where we strive to provide exceptional banking services to our customers.</p>
                <p>At XYZ Bank, we believe in building strong relationships with our clients and communities.</p>
                <p>With a team of dedicated professionals, we are committed to delivering innovative financial solutions tailored to meet your needs.</p>
                <p>As a trusted financial institution, we prioritize transparency, integrity, and customer satisfaction.</p>
                <p>Explore our services and discover why XYZ Bank is your trusted partner in finance.</p>
            </div>
        </div>
    );
};

export default AboutUs;
