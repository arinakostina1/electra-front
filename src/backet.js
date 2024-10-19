import React, { useEffect, useState } from 'react';

function S3BucketContent() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    // Fetch the data from the public S3 URL
    fetch('https://hackatonbucket1.s3.eu-central-1.amazonaws.com/Folder/')
      .then((response) => {
        if (response.ok) {
          return response.text(); // For XML or directory listing in text format
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        console.log('Data fetched:', data);
        setContent(data); // Save the fetched data to state
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  return (
    <div style={{marginTop: '30px' }}>
      <h3>Bucket Content:</h3>
      <pre>{content}</pre>
    </div>
  );
}

export default S3BucketContent;
