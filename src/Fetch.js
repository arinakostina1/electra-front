// import React, { useEffect, useState } from 'react';

// function FetchDataComponent() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('https://electricity-calculator.cy/api/getCurrentRate'); // Replace with your URL
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const jsonData = await response.json();
//         setData(jsonData);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []); // Empty dependency array means this will run once when the component mounts.

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h1>Fetched Data:</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// }

// export default FetchDataComponent;


export const fetchDataComponent = async () => {
    const response = await fetch('https://electricity-calculator.cy/api/getCurrentRate');
    const data = await response.json();
    return [data.breakdown, data.total];
  };