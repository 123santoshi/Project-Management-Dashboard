import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure axios is imported
import { useNavigate, useParams } from 'react-router-dom';
import "./Addedituser.css"

const AddEditUser = () => { 
  const navigate= useNavigate();

  const {id} = useParams();
  const initialValues = {
    firstname: "",
    lastname: "",
    fullname: "",
    email: ""
  };
  
  const [formData, setFormData] = useState(initialValues);

  // Function to get a single user's data
  const getSingleUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/users/${id}`);
      console.log("res==", res);
      setFormData(res.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    console.log("idd==",id);
    if (id) {
      getSingleUser(id);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      fullname: `${prevState.firstname} ${prevState.lastname}`
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
        if (id) {
            // If an ID exists, update the user
            const data = await axios.put(`http://localhost:8000/users/${id}`, formData);
            console.log("User updated:", data);

            if (data.status === 200) {
                alert("User details updated successfully");
                navigate("/users");
            }
        } else {
            // If no ID, create a new user
            const data = await axios.post("http://localhost:8000/users", formData);
            console.log("data==", data);

            if ( data.data.message === "New user record inserted successfully") {
                alert("User created successfully");
                navigate("/users");
            } else {
                const err = data.response?.data?.error || "An error occurred";
                console.log("err=", err);
                alert(err);
                navigate("/users");
            }
        }
    } catch (error) {
        console.error("Error in submitHandler:", error);
        const errMessage = error.response?.data?.error || "An unexpected error occurred";
        alert(errMessage);
    }
};


  return (
    <div>
      <form className="edituser-form" onSubmit={submitHandler}>
        <label>
          <strong>First Name</strong>
          <input
            type="text"
            name="firstname"
            placeholder="Enter first name"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <strong>Last Name</strong>
          <input
            type="text"
            name="lastname"
            placeholder="Enter last name"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <strong>Email</strong>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">
          {id ? "Update User" : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddEditUser;
