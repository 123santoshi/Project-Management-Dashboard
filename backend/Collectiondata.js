import mongoose from "mongoose";
import express from 'express';

const router = express.Router();

// Tasks collection schema
const projectSchema = new mongoose.Schema({
    task_name: { type: String, required: true },      
    owner: { type: String, required: true },        
    task_startdate: { type: Date, default: Date.now }, 
    task_enddate: { type: Date, required: true },   
    task_status: { type: String, default: 'Notstarted' },
    spent_time: [{
        time: { type: String },
        description: { type: String },
        logdate: { type: Date, default: Date.now }
    }]               
});


const ProjectModel = mongoose.model('Project', projectSchema);

// Get all tasks
router.get("/", async (req, res) => {
    try {
        const data = await ProjectModel.find({});
        res.json(data);  
    } catch (err) {
        console.log("Error while fetching the task data");
        res.json({ "error": "Error while fetching the task data", details: err });
    }
});

// Get task status options
router.get("/taskstatus", async (req, res) => {
    try {
        const taskstatus = ['Notstarted', 'Inprogress', 'Devcompleted', 'QAtesting', 'Completed'];
        res.json(taskstatus);  
    } catch (err) {
        console.log("Error while fetching the task status data");
        res.json({ "error": "Error while fetching the task status data", details: err });
    }
});

// Get task by ID
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const existedid_data = await ProjectModel.findById(id);
        if(existedid_data){
            res.json(existedid_data);
        } else {
            res.status(404).json("No task found with that ID");
        }
    } catch (err) {
        console.log("Error while fetching the single task data");
        res.json({ "error": "Error while fetching the single task data", details: err });
    }
});

// Add a new task
router.post("/", async (req, res) => {
    try {
        const get_data = req.body;
        const newProject = await ProjectModel.create(get_data);
        res.status(200).json({
            message: "Data inserted successfully",
            data: newProject
        });
    } catch (err) {
        console.log("Error while adding the task data:", err);
        res.status(500).json({ 
            error: "Error while adding the task data", 
            details: err.message 
        });
    }
});


router.post('/tasks/:taskId/logtime', async (req, res) => {
    const { taskId } = req.params;
    const { time, description } = req.body;
  
    try {
      const task = await ProjectModel.findById(taskId);
      if (!task) {
        return res.status(404).send({ message: "Task not found" });
      }
  
      task.spent_time.push({ time, description });
      await task.save();
  
      res.status(200).send({ message: "Time logged successfully", task });
    } catch (error) {
      console.error("Error logging time:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
});


// Update task by ID
router.put("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const existedid = await ProjectModel.findById(id);
        if(existedid){
            const data = req.body;
            const updatedata = await ProjectModel.findByIdAndUpdate(id, data);
            if(updatedata){
                res.status(200).json("Task updated successfully");
            } else {
                res.status(500).json("Error while updating the task details");
            }
        } else {
            res.status(404).json("No task found with that ID");
        }
    } catch(err) {
        console.log("Error while updating the task data");
        res.status(500).json({ 
            error: "Error while updating the task data", 
            details: err.message 
        });
    }
});

// Delete task by ID
router.delete("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const existedid = await ProjectModel.findById(id);
        if(existedid){
            const deleteuser = await ProjectModel.findByIdAndDelete(id);
            if(deleteuser){
                res.status(200).json("Task deleted successfully");
            } else {
                res.status(500).json("Error while deleting the task");
            }
        } else {
            res.status(404).json("No task found to delete with that ID");
        }
    } catch(err) {
        console.log("Error while deleting the task data");
        res.status(500).json({ 
            error: "Error while deleting the task data", 
            details: err.message 
        });
    }
});

export default router;
