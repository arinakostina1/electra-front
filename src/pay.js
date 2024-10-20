import React from 'react';

const Pay = ({amount, setLastTotalAmountCost}) => {
  const handleButtonClick = () => {
    window.open('http://localhost:80/create_payment/'+ amount, '_blank');
    setLastTotalAmountCost(0);
    console.log('Payment button clicked');
    console.log('Amount to pay: ', amount);
  };

  return (
    <button onClick={handleButtonClick} style={buttonStyle}>
      Pay your green bill
    </button>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  color: '#fff',
  backgroundColor: '#28a745', // light green #28a745
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Pay;
