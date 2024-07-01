const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const Register = require("./config.js");
const Event = require("../models/register.js")
const { json } = require("express");
const app = express();
const static_path = path.join(__dirname,"../public");
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
 
app.get("/", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async(req,res)=>{
    try {
        const { name,email, password, cpassword } = req.body;
        if (password !== cpassword) {
            throw new Error("Passwords do not match");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Register({
            name:name,
            email: email,
            password: hashedPassword,
            cpassword: hashedPassword 
        });
        const savedUser = await newUser.save();
        console.log("User registered:", savedUser);
        res.render("login"); 
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(400).json({ error: error.message }); 
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.render("home", { user }); // Pass the user details to the register page
        } else {
            throw new Error("Invalid login credentials");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(400).json({ error: error.message });
    }
});
app.post("/events", async (req, res) => {
    try {
        const { userId, name, description, date, time, location, capacity, selectEvents } = req.body;
        
        const event = new Event({
            userId,
            name,
            description,
            date,
            time,
            location,
            capacity,
            selectEvents
        });
        
        const savedEvent = await event.save();
        console.log("Event registered:", savedEvent);
  
        const user = await Register.findById(userId);
        
        res.redirect(`/viewevent?userId=${userId}`);
    } catch (error) {
        console.error("Error registering event:", error);
        res.status(400).json({ error: error.message });
    }
});



app.get("/viewevent", async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await Register.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const events = await Event.find({ userId });
        res.render("viewevent", { user, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Error fetching events");
    }
});



//edit event routes both get and post 
app.get("/events/:eventId/edit", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error("Event not found");
        }
        res.render("editevent", { event });
    } catch (error) {
        console.error("Error fetching event for edit:", error);
        res.status(500).send("Error fetching event for edit");
    }
});
app.post("/events/:eventId/edit", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const { name, description, date, time, location, capacity, selectEvents } = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(eventId, {
            name,
            description,
            date,
            time,
            location,
            capacity,
            selectEvents
        }, { new: true });
        if (!updatedEvent) {
            throw new Error("Event not found");
        }
        console.log("Event updated:", updatedEvent);
        res.redirect(`/viewevent?userId=${updatedEvent.userId}`);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).send("Error updating event");
    }
});


// cancel get route
app.post("/events/:eventId/cancel", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            throw new Error("Event not found");
        }
        console.log("Event canceled:", deletedEvent);
        res.redirect(`/viewevent?userId=${deletedEvent.userId}`);
    } catch (error) {
        console.error("Error canceling event:", error);
        res.status(500).send("Error canceling event");
    }
});


/**-------------No probelm everything works well ----------------------------------**/

















/** end of the problem  **/
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


