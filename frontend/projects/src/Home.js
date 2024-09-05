import React from 'react'
import "./Home.css";
import { Link, Navigate } from 'react-router-dom';



const Home = () => {
  return (
    <div className='home-container'>
      <div className='homepage-heading'> 
          <h1>Project Management</h1>
      </div>
      <div className='home-navbar'>
        <ul>
          <li active><Link to="/users">Users</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to ="/task_dashboard">Task Dashboard</Link></li>
          <li><Link to="/reports">Log Report</Link></li>
          <li><Link to="/tasksummary_report">TaskSummary report</Link></li>
        </ul>
      </div>
      
    </div>
  )
}

export default Home;
