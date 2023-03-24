import React, { useState } from 'react';

const SendRequestButton = ({ label, onClick }) => {
    return (
        <button
          onClick={onClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
        >
          {label}
        </button>
      );
    
};

export default SendRequestButton;