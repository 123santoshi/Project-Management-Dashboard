import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./Taskdashboard.css";
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Taskdashboard = () => {
  const initialCount = {
    total_tasks: 0,
    not_started: 0,
    inprogress: 0,
    completed: 0,
    dev_completed: 0,
    due_tasks: 0,
  };

  const [taskcount, setTaskcount] = useState(initialCount);
  const [alltasks, setAlltasks] = useState([]);
  const [taskstatus, setTaskstatus] = useState([]);
  const [notstartedtasks, setNotstartedtasks] = useState([]);
  const [inprogresstasks, setInprogresstasks] = useState([]);
  const [completedtasks, setCompletedtasks] = useState([]);
  const [devcompletedtasks, setDevcompletedtasks] = useState([]);
  const [duetasks, setDuetasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('total_tasks');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getTaskstatus = async () => {
    try {
      const response = await axios.get("http://localhost:8000/tasks/taskstatus");
      setTaskstatus(response.data);
    } catch (error) {
      console.error("Error fetching task statuses:", error);
    }
  };

  const getSingleTask = async () => {
    try {
      const res = await axios.get("http://localhost:8000/tasks");
      const updatedCount = { ...initialCount, total_tasks: res.data.length };

      const now = new Date();

      // Filter tasks based on status
      const notstarted = res.data.filter(item => item.task_status === "Notstarted");
      const inprogress = res.data.filter(item => item.task_status === "Inprogress");
      const completed = res.data.filter(item => item.task_status === "Completed");
      const devcompleted = res.data.filter(item => item.task_status === "Devcompleted");
      const due = res.data.filter(item => new Date(item.task_enddate) < now);

      updatedCount.not_started = notstarted.length;
      updatedCount.inprogress = inprogress.length;
      updatedCount.completed = completed.length;
      updatedCount.dev_completed = devcompleted.length;
      updatedCount.due_tasks = due.length;

      setTaskcount(updatedCount);
      setNotstartedtasks(notstarted);
      setInprogresstasks(inprogress);
      setCompletedtasks(completed);
      setDevcompletedtasks(devcompleted);
      setDuetasks(due);
      setAlltasks(res.data);
    } catch (error) {
      console.error("Error fetching task data", error);
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const changeformat = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : "";
  };

  const getTasksToDisplay = () => {
    let filteredTasks = [];
    switch (selectedTab) {
      case 'not_started':
        filteredTasks = notstartedtasks;
        break;
      case 'in_progress':
        filteredTasks = inprogresstasks;
        break;
      case 'completed':
        filteredTasks = completedtasks;
        break;
      case 'dev_completed':
        filteredTasks = devcompletedtasks;
        break;
      case 'due_tasks':
        filteredTasks = duetasks;
        break;
      default:
        filteredTasks = alltasks;
    }

    if (selectedUser) {
      filteredTasks = filteredTasks.filter(task => task.owner === selectedUser);
    }
    if (selectedTask) {
      filteredTasks = filteredTasks.filter(task => task.task_status === selectedTask);
    }

    /*if (startDate && endDate) {
      const start = new Date(startDate).toISOString().split('T')[0];
      const end = new Date(endDate).toISOString().split('T')[0];
      filteredTasks = filteredTasks.filter(task => {
        const taskEndDate = new Date(task.task_enddate).toISOString().split('T')[0];
        return taskEndDate >= start || taskEndDate <= end;
      });
    }*/
      const addOneDay = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

      if (startDate) {
        const start = addOneDay(startDate);
        console.log("start==",start);
        filteredTasks = filteredTasks.filter(task => {
          const taskStartdate = new Date(task.task_startdate).toISOString().split('T')[0];
          return taskStartdate >= start;
        });
      }
      
      if (endDate) {
        const end = addOneDay(endDate);
        console.log("end==",end);
        filteredTasks = filteredTasks.filter(task => {
          const taskEndDate = new Date(task.task_enddate).toISOString().split('T')[0];
          return taskEndDate <= end;
        });
      }
      

    return filteredTasks;
  };

  useEffect(() => {
    getUsers();
    getSingleTask();
    getTaskstatus();
  }, []);

  const downloadCSV = () => {
    const tasks = getTasksToDisplay();
    const headers = ["Task Name", "Owner", "Start Date", "End Date", "Status"];
    const rows = tasks.map(task => [
      task.task_name,
      task.owner,
      changeformat(task.task_startdate),
      changeformat(task.task_enddate),
      task.task_status
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "taskdashboard_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className='taskdashboard-container'>
      <div className='task-header'>
        <Link to="#" className='task-link' onClick={() => handleTabClick('total_tasks')}>
          <div>
            <h3 className='text-primary'>Total Tasks</h3>
            <p>{taskcount.total_tasks}</p>
          </div>
        </Link>
        <Link to="#" className='task-link' onClick={() => handleTabClick('not_started')}>
          <div>
            <h3 className='text-warning'>Not Started</h3>
            <p>{taskcount.not_started}</p>
          </div>
        </Link>
        <Link to="#" className='task-link' onClick={() => handleTabClick('in_progress')}>
          <div>
            <h3 className='text-secondary'>In Progress</h3>
            <p>{taskcount.inprogress}</p>
          </div>
        </Link>
        <Link to="#" className='task-link' onClick={() => handleTabClick('completed')}>
          <div>
            <h3 className='text-success'>Completed</h3>
            <p>{taskcount.completed}</p>
          </div>
        </Link>
        <Link to="#" className='task-link' onClick={() => handleTabClick('dev_completed')}>
          <div>
            <h3 className='text-info'>Dev Completed</h3>
            <p>{taskcount.dev_completed}</p>
          </div>
        </Link>
        <Link to="#" className='task-link' onClick={() => handleTabClick('due_tasks')}>
          <div>
            <h3 className='text-danger'>Due Tasks</h3>
            <p>{taskcount.due_tasks}</p>
          </div>
        </Link>
      </div>

      <div className="search-user">
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
          name="selectedTask"
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
        >
          <option value="">Select Task status</option>
          {taskstatus.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>

        

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

        <button onClick={downloadCSV}> <i className="fas fa-download"></i></button>
      </div>

      {getTasksToDisplay().length > 0 ? (
        <table>
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
            {getTasksToDisplay().map((task) => (
              <tr key={task._id}>
                <td>{task.task_name}</td>
                <td>{task.owner}</td>
                <td>{changeformat(task.task_startdate)}</td>
                <td>{changeformat(task.task_enddate)}</td>
                <td>{task.task_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "No tasks to display"
      )}
    </div>
  );
};

export default Taskdashboard;
