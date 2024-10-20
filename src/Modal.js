// Modal.js (Create a separate modal component)
import React from 'react';

const Modal = ({ show, onClose }) => {
  if (!show) {
    return null; // Don't render the modal if `show` is false
  }

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>Successful Payment</h2>
        <p>Your payment was processed successfully.</p>
        <button onClick={onClose} style={buttonStyle}>Close</button>
      </div>
    </div>
  );
};

// Basic styling for the modal
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default Modal;
