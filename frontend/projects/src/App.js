import './App.css';
import Home from './Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Users from './Users';
import AddEditUser from './AddEditUser';
import Tasks from './Tasks';
import AddEditTask from './AddEditTask';
import Taskdashboard from './Taskdashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logtime from './Logtime';
import Reports from './Reports';
import Tasksummary from './Tasksummary';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Home />
        <Routes>
          <Route path="/" element={<Navigate to="/users" />} /> 
          <Route path="/users" element={<Users />} />
          <Route path="/task_dashboard" element={<Taskdashboard />} />
          <Route path="/addedit/:id" element={<AddEditUser />} />
          <Route path="/addedit" element={<AddEditUser />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/tasksummary_report" element={<Tasksummary />} />
          <Route path="/addedittask" element={<AddEditTask />} />
          <Route path="/addedit/task/:id" element={<AddEditTask />} />
          <Route path="/logtime/:id" element={<Logtime />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
