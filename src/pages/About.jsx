import React from "react";

const About = () => {
  return (
    <div className="container my-5 bg-white p-4 rounded"> {/* White texture background */}
      <h1 className="text-center display-4 mb-4 text-black">About Indic Wisdom</h1>
      <p className="lead text-center font-lora">
        Ancient Indian philosophy and teachings are a treasure trove of wisdom, offering profound insights into life, spirituality, and the universe. 
        From the Bhagavad Gita to the Upanishads, these texts have inspired countless generations and continue to guide humanity toward a path of self-realization and harmony.
      </p>
      <p className="lead text-center font-lora">
        The purpose of this website is to provide an easy and fast way to access this timeless knowledge. Built by{" "}
        <a 
          href="https://github.com/ctheface" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="about-ctheface-link"
        >
          ctheface
        </a>, 
        Indic Wisdom aims to bridge the gap between ancient teachings and modern technology, making these teachings accessible to everyone.
      </p>
    </div>
  );
};

export default About;