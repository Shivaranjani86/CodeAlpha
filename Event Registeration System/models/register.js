
const mongoose=require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/evrs");

const eventSchema =new mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, // Assuming you store time as a string (HH:mm format)
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    selectEvents: {
        type: String, // Assuming select events is a dropdown with string values
        required: true
    }
    
});

const eventsreg = new mongoose.model("eventreg",eventSchema);
module.exports = eventsreg;