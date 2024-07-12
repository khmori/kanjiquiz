import React, { useState, useEffect } from 'react';

function Balls() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // If you're using Create React App and the file is in the public folder
    const path = '../../public/gr1.json';
    const path2 = '../assets/decks/gr1.json';
    fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('There has been a problem with your fetch operation:', error));
  }, []);

  return (
    <div>
      {/* Render your data here */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export default Balls;
