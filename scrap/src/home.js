import React, { useState } from 'react';

const HomeScreen = () => {
  const [isScraping, setIsScraping] = useState(false);

  const handleScrape = async () => {
    setIsScraping(true);
    
    try {
      // 1. Call your backend script
      //const response = await fetch('http://localhost:5000/scrape');
      const API_URL = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://cameroon-scraper.onrender.com";

      // Ensuite tu utilises API_URL dans tes fetch
      const response = await fetch(`${API_URL}/scrape`);
      const blob = await response.blob();

      // 2. Create a download link for the XML file
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'scraped_data.xml');
      
      // 3. Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      
    } catch (error) {
      console.error("Scraping failed:", error);
      alert("Something went wrong!");
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Web Scraper Tool</h1>
      <p>Click the button below to start the XML extraction.</p>
      
      <button 
        onClick={handleScrape} 
        disabled={isScraping}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: isScraping ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isScraping ? 'not-allowed' : 'pointer'
        }}
      >
        {isScraping ? 'Scraping in Progress...' : 'Launch Scraper'}
      </button>
    </div>
  );
};

export default HomeScreen;
