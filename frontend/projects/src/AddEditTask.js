import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "./AddEditTask.css";

const AddEditUser = () => { 
  const navigate = useNavigate();
  const { id } = useParams();

  const initialValues = {
    task_name: "",
    owner: "",
    task_startdate: new Date().toISOString().split('T')[0], // Initialize with today's date
    task_enddate: "",
    task_status: ""
  };
  
  const [formData, setFormData] = useState(initialValues);
  const [userlist, setUserlist] = useState([]);
  const [taskstatuslist, setTaskstatuslist] = useState([]);

  // Function to get a single task's data
  const getSingleTask = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/tasks/${id}`);
      let taskData = res.data;
      // Format the task_enddate and task_startdate to 'YYYY-MM-DD'
      if (taskData.task_enddate) {
        taskData.task_enddate = new Date(taskData.task_enddate).toISOString().split('T')[0];
      }
      if (taskData.task_startdate) {
        taskData.task_startdate = new Date(taskData.task_startdate).toISOString().split('T')[0];
      }

      console.log("Formatted task data for update:", taskData);
      setFormData(taskData);
    } catch (error) {
      console.error("Error fetching task data", error);
    }
  };

  // Function to fetch all users for the owner dropdown
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/users");
      console.log("data from fetch users==", data);
      setUserlist(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchTaskstatus = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/tasks/taskstatus");
      console.log("data from fetch taskstatus=", data);
      setTaskstatuslist(data);
    } catch (error) {
      console.error("Error fetching task status", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTaskstatus();
    if (id) {
      getSingleTask(id);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate that task_enddate is greater than or equal to task_startdate
    const { task_startdate, task_enddate } = formData;
    console.log("start==", task_startdate, "end==", task_enddate);
    console.log("formdata=", formData);
    if (task_startdate && task_enddate) {
      if (new Date(task_enddate).toISOString().split('T')[0] < new Date(task_startdate).toISOString().split('T')[0]) {
        alert("End date cannot be earlier than start date.");
        return;
      }
    }

    try {
      if (id) {
        const data = await axios.put(`http://localhost:8000/tasks/${id}`, formData);
        console.log("data after updating==", data.status);
        alert("Task details updated successfully");
        if (data.status === 200) {
          navigate("/tasks");
        }
      } else {
        const data = await axios.post("http://localhost:8000/tasks", formData);
        console.log("data after inserted==", data.status);
        alert("Task created successfully");
        if (data.status === 200) {
          navigate("/tasks");
        }
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div>
      <form className="edituser-form" onSubmit={submitHandler}>
        <label>
          <strong>Task Name</strong>
          <input
            type="text"
            name="task_name"
            placeholder="Enter task name"
            value={formData.task_name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <strong>Owner</strong>
          <select 
            name="owner" 
            value={formData.owner} 
            onChange={handleInputChange} 
            required
          >
            <option value="" disabled>Select owner</option>
            {
                userlist.map((item) => (
                    <option key={item._id} value={item.fullname}>
                      {item.fullname}
                    </option>
                ))
            }
          </select>
        </label>
        <label>
          <strong>Task Start Date</strong>
          <input
            type="date"
            name="task_startdate"
            value={formData.task_startdate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <strong>Task End Date</strong>
          <input
            type="date"
            name="task_enddate"
            value={formData.task_enddate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          <strong>Task Status</strong>
          <select 
            name="task_status" 
            value={formData.task_status} 
            onChange={handleInputChange} 
            required
          >
            <option value="" disabled>Select Task status</option>
            {
                taskstatuslist.map((item) => (
                    <option key={item._id} value={item}>
                      {item}
                    </option>
                ))
            }
          </select>
        </label>
        <button type="submit">
          {id ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddEditUser;
