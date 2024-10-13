import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 

 
  const accessKey = 'TGaGjs8jQYP2nsqxv68u8fgSdqWUrykIsb5xOahfWoQ';


  const fetchImages = useCallback(async () => {
    if (!hasMore || loading) return; 

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/?client_id=${accessKey}&page=${page}&per_page=30`
      );

      setImages((prevImages) => [...prevImages, ...response.data]);

      
      if (response.data.length === 0 || response.data.length < 30) {
        setHasMore(false); 
      }
    } catch (error) {
      console.error('Error fetching images', error);
    }
    setLoading(false);
  }, [page, hasMore, loading]);

  
  const handleScroll = useCallback(() => {
    
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, []);


  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="App">
     <h1>
      Geekster's Infinite Scroll Gallery
      <span className="signature"> Abhishek Pal : FS20</span>
    </h1>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-item">
            <img src={image.urls.small} alt={image.alt_description} />
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more images available.</p>}
    </div>
  );
}

export default App;
