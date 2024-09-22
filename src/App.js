import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css'; // Import the CSS file

// Options for the multi-select dropdown
const options = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highestLowercaseAlphabet', label: 'Highest Lowercase Alphabet' }
];

const InputForm = () => {
  const [jsonInput, setJsonInput] = useState('');  // State for JSON input
  const [responseData, setResponseData] = useState(null);  // State to store response data
  const [selectedOptions, setSelectedOptions] = useState([]);  // State to track selected filters
  const [error, setError] = useState('');  // State for errors
  const [file, setFile] = useState(null);  // State to track the uploaded file

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Store the selected file in the state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(''); // Reset any existing errors

    try {
      // Parse the JSON input
      const parsedData = JSON.parse(jsonInput);

      // Prepare FormData to send JSON and file to the server
      const formData = new FormData();
      formData.append('data', JSON.stringify(parsedData)); // Append JSON data as a string
      if (file) {
        formData.append('file', file); // Append the uploaded file if it exists
      }

      // Call the backend API with FormData
      const res = await axios.post('http://localhost:5000/bfhl', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Use multipart/form-data for file upload
        },
      });

      setResponseData(res.data); // Save the server's response in state
    } catch (err) {
      setError('Invalid JSON input or file upload error. Please try again.');
    }
  };

  // Handle changes in the multi-select dropdown
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected || []); // Update selected options, handling case where nothing is selected
  };

  // Filter and render the response based on selected options
  const renderResponse = () => {
    if (!responseData) return null;

    const filteredResults = [];

    // Render "Numbers" if selected
    if (selectedOptions.some(option => option.value === 'numbers')) {
      filteredResults.push(`Numbers: ${responseData.numbers.join(', ')}`);
    }

    // Render "Alphabets" if selected
    if (selectedOptions.some(option => option.value === 'alphabets')) {
      filteredResults.push(`Alphabets: ${responseData.alphabets.join(', ')}`);
    }

    // Render "Highest Lowercase Alphabet" if selected
    if (selectedOptions.some(option => option.value === 'highestLowercaseAlphabet')) {
      filteredResults.push(`Highest Lowercase Alphabet: ${responseData.highest_lowercase_alphabet}`);
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        <pre>{filteredResults.join('\n')}</pre> {/* Display the filtered results */}
      </div>
    );
  };

  return (
    <div className="input-form-container">
      <form onSubmit={handleSubmit}>
        {/* JSON input field */}
        <label>API Input</label>
        <textarea
          className="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows="4"
          placeholder='{"data": ["A", "C", "1", "z"]}' // Placeholder for example JSON structure
        />

        {/* File input field */}
        <label>Upload File</label>
        <input 
          type="file"
          onChange={handleFileChange}
          accept="image/*, .pdf, .doc, .docx" // Specify accepted file types (optional)
        />

        {/* Submit button */}
        <button className="submit-button" type="submit">Submit</button>

        {/* Error message display */}
        {error && <p className="error-text">{error}</p>}
      </form>

      {/* Multi-select dropdown for filtering the response */}
      {responseData && (
        <div>
          <label>Multi Filter</label>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            placeholder="Select options"
          />
        </div>
      )}

      {/* Display the filtered response */}
      {renderResponse()}
    </div>
  );
};

export default InputForm;
