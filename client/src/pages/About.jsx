import React from "react";
import "./About.css";
import RegistrationNavbar from "../components/RegistrationNavbar";

const AboutUs = () => {
  return (
    <>
      <RegistrationNavbar />
      <div className="aboutus-header-line"></div> {/* White line separator */}
      <div className="aboutus-background">
        <div className="aboutus-content">
          <h1>About Us</h1>
          <h2> </h2>
          <p>
            Welcome to Sign-X-Wave! Our mission is to make sign language learning
            accessible and engaging for everyone. We believe in breaking
            communication barriers and fostering inclusivity through technology.
          </p>
          <p>
            Our platform uses cutting-edge AI to help users practice and master
            sign language in an interactive and fun way. Whether you're a beginner
            or looking to refine your skills, Sign-X-Wave is here to support your
            journey.
          </p>
          <p>
            Thank you for joining us on this journey to make communication more
            inclusive and accessible for everyone!
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;