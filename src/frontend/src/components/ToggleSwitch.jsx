import React, { useState } from 'react';

const ToggleSwitch = ({ label, onChange }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [body, setBody] = useState('');

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <div style={{ color: '#fff', marginRight: '10px' }}>{label}</div>
      <label
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '60px',
          height: '34px',
        }}
        className={`switch ${isChecked ? 'checked' : ''}`}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          style={{ display: 'none' }}
        />
        <span
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            borderRadius: '34px',
            backgroundColor: '#ccc',
            transition: 'all 0.3s',
          }}
          className="slider round"
        >
          {isChecked ? 'POST' : 'GET'}
        </span>
      </label>
      {isChecked && (
        <div style={{ marginLeft: '10px' }}>
          <div style={{ color: '#fff', marginBottom: '5px' }}>Body</div>
          <textarea
            value={body}
            onChange={handleBodyChange}
            placeholder="Enter JSON data"
            style={{
              width: '100%',
              height: '60px',
              padding: '5px',
              border: 'none',
              borderRadius: '5px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ToggleSwitch;