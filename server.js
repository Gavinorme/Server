const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("server"));
app.use("/images", express.static("images"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

//const upload = multer({ dest: __dirname + "/projects/images" });

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/projects.html");
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

mongoose
    .connect("mongodb+srv://gorme:Gavinorme@cluster0.s2hjtru.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to mongodb")
    })
    .catch((error) => console.log("Couldn't connect to mongodb", error));


let projects = [
    {
        id:1,
        "a": "../project1-page/index.html",
        "title": "Project 1",
        "img": "images/assignment6.png",
        "descript": "In this assignment I made a webpage that incorporates javascript so that pictures can show and dance when clicked and user's are able to input text."
    },
    {
        id:2,
        "a": "#",
        "title": "Project 2",
        "img": "images/assignment7.png",
        "descript": "In this assignment I made a webpage that compares ages between three people from oldest to youngest and also shows funds raised using a graphic."
    },
    {
        id:3,
        "a": "#",
        "title": "Project 3",
        "img": "images/assign8.png",
        "descript": "In this assignment I made a webpage that has a walking and then running man that goes across the screen and also shows funds raised using a graphic."
    },
    {
        id:4,
        "a": "#",
        "title": "Project 4",
        "img": "images/assign9.png",
        "descript": "In this assignment I made a webpage that loops through five impactful quotes and makes an animated rainbow that ends with a pot of gold once finished."
    }
]

app.get("/api/projects", (req, res) => {
    res.send(projects);
});

app.get("/api/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find((r)=>r.id === id);

    if(!project) {
        res.status(404).send("The player with the given id was not found");
    }
    res.send(project);
});

app.post("/api/projects", upload.single("img"), (req, res)=> {
    
    const result = validateProject(req.body);
    
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    const project = {
        _id: projects.length + 1,
        // a: req.body.a,
        title: req.body.title,
        descript: req.body.descript,
    };

    if(req.file) {
        project.img = "images/" +req.file.filename;
    }

    projects.push(project);
    res.send(project);
});

app.put("/api/projects/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find((r)=>r.id === id);
    
    const result = validateProject(req.body);
    
    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    project.a = req.body.a;
    project.title = req.body.title;
    project.descript = req.body.descript;

    if(req.file) {
        project.img = "images/" +req.file.filename;
    }

    res.send(project);
});

app.delete("/api/projects/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const project = projects.find((r)=>r.id === id);

    if(!project) {
        res.status(400).send("The player with the given id was not found.");
        return;
    }
    console.log("before index");
    const index = projects.indexOf(project);
    projects.splice(index,1);
    res.send(project);
});

const validateProject = (project) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        // a: Joi.string().min(3).required(),
        title: Joi.string().min(3).required(),
        descript: Joi.string().min(3).required(),
        img: Joi.optional(),
    });

    return schema.validate(project);
} 


app.listen(3000, () => {
    console.log("Listening");
});
