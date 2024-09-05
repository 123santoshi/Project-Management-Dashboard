import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Reports.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Tasksummary = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]); 
    const [selectedUser, setSelectedUser] = useState("");
    const [users, setUsers] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/users");
            console.log("Users data from API =", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const getTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8000/tasks");
            //console.log("Tasks data from API =", response.data);
            const filteredTasks = response.data.filter(task => task.spent_time && task.spent_time.length > 0);
            setTasks(filteredTasks);
            setFilteredTasks(filteredTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addOneDay = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    const changeTimeformattoMins = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return (hours || 0) * 60 + (minutes || 0);
    };

    const filterTasks = () => {
        let filtered = tasks;
    
        if (selectedUser) {
            filtered = filtered.filter(task => task.owner === selectedUser);

        }

    
        if (startDate && endDate) {
            const start = addOneDay(startDate);
            const end = addOneDay(endDate);
            //console.log("Filtering by date range:", start, "to", end);
            filtered = filtered.map(task => {
                const filteredSpentTime = task.spent_time.filter(item => {
                    const logDate = new Date(item.logdate).toISOString().split('T')[0];
                    return logDate >= start && logDate <= end;
                });
                //console.log("filteredSpentTime:", filteredSpentTime); 
                const totalLogTime = filteredSpentTime.reduce((acc, item) => acc + changeTimeformattoMins(item.time), 0);
                //console.log("totalLogTime:", totalLogTime);
                return {
                    ...task,
                    totalLogTime: totalLogTime
                };
            }).filter(task => task.totalLogTime > 0); 
            //console.log("Filtered tasks after date range and log time calculation:", filtered);
        }
    
        setFilteredTasks(filtered);
    };
    
    const downloadCSV = () => {
        const headers = ["Task Name", "Owner", "Logged Time"];
        const rows = filteredTasks.map(task => [
            task.task_name,
            task.owner,
            task.loggedtime
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "Daterange_logtime_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const changeTimeformat = (val) => {

        const valObject = parseInt(val, 10); 
        const hrs = Math.floor(valObject / 60);
        const mins = valObject % 60;
        const formatTime = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
        console.log("Formatted time:", formatTime);
        
        return formatTime;
      };
    useEffect(() => {
        getUsers();
        getTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [selectedUser, startDate, endDate, tasks]);

    return (
        <div className='task-container'>
            <br/><br/><br/>
            <h3 className='text-danger'><strong className='text-dark'>Note : </strong>Select the user name and choose the date range to get the overall log time for the specified tasks.</h3>
            <br/>
            <div className='searchuser-report'>
                <DatePicker
                    className='date-picker'
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                />
                
                <DatePicker
                    className='date-picker'
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                />
                <select
                    name="selecteduser"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">Select a user</option>
                    {users.map((item) => (
                        <option key={item._id} value={item.fullname}>
                            {item.fullname}
                        </option>
                    ))}
                </select>
                <button onClick={downloadCSV}> 
                    <i className="fas fa-download"></i>
                </button>
                
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Task Name</th>
                        <th>Owner</th>
                        <th>Total Time (mins)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task.task_name}</td>
                                <td>{task.owner}</td>
                                <td>{task.totalLogTime ? changeTimeformat(task.totalLogTime): "00:00"} </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No tasks with time logs available</td> 
                                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    );
};

export default Tasksummary;
