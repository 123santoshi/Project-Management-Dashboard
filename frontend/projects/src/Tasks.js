import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Tasks.css";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [searchtask, setSearchtask] = useState("");
    const [activeTasksTab, setActiveTasksTab] = useState(true);
    const [inactiveTasks, setInactiveTasks] = useState([]);

    const getTasks = async () => {
        try {
            const tasksResponse = await axios.get("http://localhost:8000/tasks");
            //console.log("Tasks data from API =", tasksResponse.data);
            const usersResponse = await axios.get("http://localhost:8000/users");
            //console.log("Users data from API =", usersResponse.data);
            const activeUsers = usersResponse.data.map(user => user.fullname);
            // Filter tasks to include only those owned by active users and not completed
            const activeUsersTasks = tasksResponse.data.filter(task => 
                activeUsers.includes(task.owner) && task.task_status !== 'Completed'
            );
            console.log("Active users' tasks (excluding completed) =", activeUsersTasks);
            // Set the filtered tasks to state
            setTasks(activeUsersTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    
    const getInactiveUsersTasks = async () => {
        try {
            setActiveTasksTab(false);
            const tasksResponse = await axios.get("http://localhost:8000/tasks");
            const inactiveUsersResponse = await axios.get("http://localhost:8000/users/inactive");
            console.log("Inactive users in tasks==", inactiveUsersResponse.data);
            const inactiveUsers = inactiveUsersResponse.data.map(user => user.fullname);
            const inactiveUsersTasks = tasksResponse.data.filter(task => inactiveUsers.includes(task.owner));
            console.log("Inactive users' tasks==", inactiveUsersTasks);

            setInactiveTasks(inactiveUsersTasks);
        } catch (error) {
            console.error("Error fetching inactive users' tasks:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/tasks/${id}`);
            setTasks(tasks.filter(task => task._id !== id));
            setInactiveTasks(inactiveTasks.filter(task => task._id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchtask(e.target.value);
    };

    const changeFormat = (date) => {
        return date.split('T')[0];
    };

    const filteredTasks = tasks.filter(task => 
        task.task_name.toLowerCase().includes(searchtask.toLowerCase()) ||
        task.owner.toLowerCase().includes(searchtask.toLowerCase())
    );

    const filteredInactiveTasks = inactiveTasks.filter(task => 
        task.task_name.toLowerCase().includes(searchtask.toLowerCase()) ||
        task.owner.toLowerCase().includes(searchtask.toLowerCase())
    );

    useEffect(() => {
        if (activeTasksTab) {
            getTasks();
        } else {
            getInactiveUsersTasks();
        }
    }, [activeTasksTab]);

    return (
        <div className='Task-container'>
            <div className='Task-header'>
                <div className='task-btns'>
                    <button className='addtask-btn'><Link to={"/addedittask/"}>Add Task</Link></button>
                    <button className='inactivetask-btn' onClick={() => setActiveTasksTab(false)}>Inactive Users Tasks</button>
                </div>
                <h3 className='text-danger'><strong className='text-dark'>Note : </strong>Completed Tasks are not visbile here </h3>

                <input 
                    type="text" 
                    placeholder='Search tasks' 
                    name="searchtask" 
                    value={searchtask} 
                    onChange={handleSearchChange} 
                />
            </div>
            <table>
                {activeTasksTab ? (
                    <>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Owner</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map(task => (
                                    <tr key={task._id}>
                                        <td>{task.task_name}</td>
                                        <td>{task.owner}</td>
                                        <td>{task.task_startdate ? changeFormat(task.task_startdate) : ""}</td>
                                        <td>{task.task_enddate ? changeFormat(task.task_enddate) : ""}</td>
                                        <td>{task.task_status}</td>
                                        <td>
                                            <button className='text-secondary'><Link to={`/addedit/task/${task._id}`}>Edit Task</Link></button>
                                            <button className='text-danger' onClick={() => deleteTask(task._id)}>Delete Task</button>
                                            <button className='text-success'><Link to={`/logtime/${task._id}`}>Log Time</Link></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No active tasks found.</td>
                                </tr>
                            )}
                        </tbody>
                    </>
                ) : (
                    <>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Owner</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInactiveTasks.length > 0 ? (
                                filteredInactiveTasks.map(task => (
                                    <tr key={task._id}>
                                        <td>{task.task_name}</td>
                                        <td>{task.owner}</td>
                                        <td>{task.task_startdate ? changeFormat(task.task_startdate) : ""}</td>
                                        <td>{task.task_enddate ? changeFormat(task.task_enddate) : ""}</td>
                                        <td>{task.task_status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No inactive tasks found.</td>
                                </tr>
                            )}
                        </tbody>
                    </>
                )}
            </table>
        </div>
    );
};

export default Tasks;
