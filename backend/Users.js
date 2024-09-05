import mongoose from "mongoose";
import express from "express";

const userrouter = express.Router();

const usersCollection = "Users";
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: true
    },
    lastname: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        default: function () {
            return this.firstname + " " + this.lastname;
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    deleted: { 
        type: Boolean, 
        default: false 
    }
});

const userModel = mongoose.model(usersCollection, userSchema);

userrouter.get("/", async (req, res) => {
    try {
        const data = await userModel.find({ deleted: false });
        res.json(data);
    } catch (err) {
        console.error("Error while getting the users data", err);
        res.status(500).json({ error: "Error while getting the users data", details: err });
    }
});

userrouter.get("/inactive", async (req, res) => {
    try {
        const data = await userModel.find({ deleted: true });
        res.json(data);
    } catch (err) {
        console.error("Error while getting the inactive users data", err);
        res.status(500).json({ error: "Error while getting the inactive users data", details: err });
    }
});

userrouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "No user found with that id" });
        }
    } catch (err) {
        console.log("Error while fetching the single user data");
        res.status(500).json({ error: "Error while fetching the single user data", details: err });
    }
});

userrouter.post("/", async (req, res) => {
    try {
        const data = req.body;
        const { firstname, lastname, email } = data;

        const existedUser = await userModel.findOne({ firstname });
        if (existedUser) {
            return res.status(400).json({ error: "User already exists with this name" });
        }

        const existedEmail = await userModel.findOne({ email });
        if (existedEmail) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        const insertUser = await userModel.create(data);
        res.status(201).json({
            message: "New user record inserted successfully",
            data: insertUser
        });

    } catch (err) {
        console.error("Error while inserting the user data", err);
        res.status(500).json({ error: "Error while inserting the user data", details: err });
    }
});

userrouter.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(id, data, { new: true });
        if (updatedUser) {
            res.status(200).json({ message: "User record updated successfully", data: updatedUser });
        } else {
            res.status(500).json({ error: "Error while updating the user data" });
        }
    } catch (err) {
        console.error("Error while updating the user data", err);
        res.status(500).json({ error: "Error while updating the user data", details: err });
    }
});

userrouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if (user) {
            user.deleted = true;
            await user.save();
            res.status(200).json({ message: "User marked as deleted successfully" });
        } else {
            res.status(404).json({ error: "No user found with that id" });
        }
    } catch (err) {
        console.error("Error while marking the user as deleted", err);
        res.status(500).json({ error: "Error while marking the user as deleted", details: err });
    }
});

export default userrouter;
