import React from 'react';

const Pay = () => {
  const handleButtonClick = () => {
    window.open('https://app.powerbi.com/reportEmbed?reportId=6e9ec247-d891-4db6-af70-d87aac4e4731&autoAuth=true&ctid=8dd1e6b4-8dac-408e-8d8d-6753e9800530', '_blank');
  };

  return (
    <button onClick={handleButtonClick} style={buttonStyle}>
      Pay
    </button>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  color: '#fff',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Pay;
