import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Users.css";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [showUsers, setShowUsers] = useState(true);

    // Fetch active users
    const getUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/users");
            //console.log("Users data from API =", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Fetch inactive users
    const getInactiveUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/users/inactive");
            //console.log("Inactive users data from API =", response.data);
            setDeletedUsers(response.data);
        } catch (error) {
            console.error("Error fetching inactive users:", error);
        }
    };

    // Change state based on button clicked
    const changeState = (type) => {
        if (type === "users") {
            setShowUsers(true);
            getUsers();
        } else {
            setShowUsers(false);
            getInactiveUsers();
        }
    };

    // Handle user deletion (soft delete)
    const deleteUser = async (id) => {
        try {
            if (window.confirm("Do you want to delete the user? Click 'Ok' to proceed.")) {
                await axios.delete(`http://localhost:8000/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                setDeletedUsers(deletedUsers.filter(user => user._id !== id));
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    useEffect(() => {
        // Load active users on initial load
        getUsers();
    }, []);

    return (
        <div className='user-container'>
            <div className='user-header'>
                <button className='adduser-btn' onClick={() => changeState("users")}>
                    <Link to={"/addedit"}> Add User</Link>
                </button>
                <button className='inactiveuser-btn' onClick={() => changeState("inactiveusers")}>
                    Deleted Users
                </button>
                &nbsp;&nbsp;
                {showUsers ? <h3 className='users-count'> Total users :{users.length} </h3> : ""}
            </div>
            <table>
                {showUsers ? (
                    <>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Full Name</th>
                                <th>Email id</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className='text-success'>
                                            <Link to={`/addedit/${user._id}`}>Edit User</Link>
                                        </button>
                                        <button className='text-danger' onClick={() => deleteUser(user._id)}>
                                            Delete User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                ) : (
                    <>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Full Name</th>
                                <th>Email id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.firstname}</td>
                                    <td>{user.lastname}</td>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                )}
            </table>
        </div>
    );
};

export default Users;
