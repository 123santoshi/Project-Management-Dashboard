import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import "./Logtime.css";

const Logtime = () => {
  const { id } = useParams(); 
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure the changeTimeformat function is called correctly
      const formattedTime = changeTimeformat(time);
      console.log("Time changed after formatting:", formattedTime);

      const response = await axios.post(`http://localhost:8000/tasks/${id}/logtime`, {
        time: formattedTime,
        description,
      });

      alert("Time logged successfully");
      console.log("Time logged:", response.data);

      // Clear form fields
      setTime('');
      setDescription('');
      
      // Navigate to tasks page
      navigate("/tasks");
    } catch (error) {
      console.error("Error logging time:", error);
    }
  };

  const changeHandler = (e) => {
    const getTime = e.target.value;
    console.log("getTime:", getTime);
    setTime(getTime);
  };

  const changeTimeformat = (val) => {
    console.log("changeTimeformat function called with val:", val);

    const valObject = parseInt(val, 10); // Ensure val is converted to an integer
    console.log("valObject (parsed time):", valObject);

    // Calculate hours and minutes
    const hrs = Math.floor(valObject / 60);
    const mins = valObject % 60;
    console.log("hrs:", hrs, "mins:", mins);

    // Format the time as HH:mm
    const formatTime = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    console.log("Formatted time:", formatTime);
    
    return formatTime;
  };

  return (
    <div className='logtime-container'>
      <form className='logtime-form' onSubmit={handleSubmit}>
        <label>
          <strong>Spent Time</strong>
          <input
            type="text"
            placeholder="Enter time in minutes"
            value={time}
            onChange={changeHandler}
            required
          />
        </label>
        <label>
          <strong>Work Description</strong>
          <textarea
            placeholder="Enter Work Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <button type="submit" className='submit-button'>Log Time</button>
      </form>
    </div>
  );
};

export default Logtime;
