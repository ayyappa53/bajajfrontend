import React, { useState } from 'react';
import './index.css'; // Import the CSS file

function JsonInput({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log(inputValue);
      const parsedData = JSON.parse(inputValue);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON structure');
      }
      setError(null);
      onSubmit(parsedData);
    } catch (err) {
      console.log(err);
      setError('Invalid JSON format');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="json-input-form">
        <textarea
          value={inputValue}
          onChange={handleChange}
          rows="5"
          cols="50"
          className="json-input-textarea"
          placeholder="Enter JSON data..."
          autoFocus
        />
        <br />
        <button type="submit" className="json-input-button">Submit</button>
      </form>
      {error && <p className="json-input-error">{error}</p>}
    </div>
  );
}

export default JsonInput;
