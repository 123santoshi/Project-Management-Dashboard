import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Reports.css";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Tasks = () => {
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

    const changeDateformat = (changedate) => {
        const change_date = new Date(changedate).toISOString().split('T')[0];
        return change_date;
    };

    const getTasks = async () => {
        try {
            const response = await axios.get("http://localhost:8000/tasks");
            console.log("Tasks data from API =", response.data);

            const filteredTasks = response.data.filter(task => task.spent_time && task.spent_time.length > 0);

            const flattenedTasks = filteredTasks.flatMap(task =>
                task.spent_time.map(entry => ({
                    task_name: task.task_name,
                    owner: task.owner,
                    time: entry.time,
                    description: entry.description,
                    logdate: changeDateformat(entry.logdate)
                }))
            );

            setTasks(flattenedTasks);
            setFilteredTasks(flattenedTasks); 
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const filterTasks = () => {
        let filtered = tasks;
    
        if (selectedUser) {
            filtered = filtered.filter(task => task.owner === selectedUser);
        }
    
        const addOneDay = (dateString) => {
            const date = new Date(dateString);
            date.setDate(date.getDate() + 1);
            return date.toISOString().split('T')[0];
        };
        
        if (startDate && endDate) {
            const start = addOneDay(startDate);
            const end = addOneDay(endDate);
            console.log("start==",start,"end==",end);
            filtered = filtered.filter(task => {
                const logDate = new Date(task.logdate).toISOString().split('T')[0];
                return logDate >= start && logDate <= end;
            });
        }
        
        
    
        setFilteredTasks(filtered);
    };
    

    const downloadCSV = () => {
        const headers = ["Task Name", "Logged Date", "Owner", "Log Time", "Description"];
        const rows = filteredTasks.map(task => [
            task.task_name,
            task.logdate,
            task.owner,
            task.time,
            task.description
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "TASK_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        <th>Logged Date</th>
                        <th>Owner</th>
                        <th>Log Time</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task.task_name}</td>
                                <td>{task.logdate}</td>
                                <td>{task.owner}</td>
                                <td>{task.time}</td>
                                <td>{task.description}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No tasks with time logs available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Tasks;
