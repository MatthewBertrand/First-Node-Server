// install, import, create
import express from "express";
import mysql from "mysql2";

const server = express();
server.use(express.json());

// to run a port number is required
const port = 4890;

const db = mysql.createPool(
{
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "web24",
    connectionLimit: 10
})

server.listen(port, function()
{
    console.log("The server is now running in port no:", port);
});

// name: hello
// respond with "Hello!"

server.get('/hello', function(req, res)
{
    console.log(req.query.name, req.query.age, req.query.city);
    res.json({ response: "Hello, " + req.query.name + " from " + req.query.city + " who is " + req.query.age + " years old" });
    //res.send("Hello!");
});

server.get('/jokes', function(req, res)
{
    //it works but its not the proper way
    //res.json({ response: "The first joke is: Programming is 10% writing code and 90% understanding why it's not working." + " The second joke is: If at first you don't succeed, call it version 1.0" });
    
    //the proper way
    let jokes = [
        {
            id: 1,
            joke: "Programming is 10% writing code and 90% understanding why it's not working."
        },
        {
            id: 2,
            joke: "If at first you don't succeed, call it version 1.0."
        }
    ]

    res.json(jokes);
});

server.get('/login', function(req, res)
{
    res.json({ message: "Received login credentials: " + req.query.username + " " + req.query.password });
});

server.get("/students", function(req, res)
{
    let sqlQuery = "CALL `ShowAllStudents`()";
    db.query(sqlQuery, function(error, data)
    {
        if(error)
        {
            res.json({ message: error})
        }
        else
        {
            res.json(data);
        }
    })
});

server.get("/students/inperson", function(req, res)
{
    let sqlQuery = "CALL `ShowAllStudentsInPerson`()";
    db.query(sqlQuery, function(error, data)
    {
        if(error)
        {
            res.json({ message: error})
        }
        else
        {
            res.json(data);
        }
    })
});

server.get("/students/:id", function(req, res)
{
    let sqlQuery = "CALL `FindStudentDetailsByID`(?)";

    db.query(sqlQuery, [req.params.id], function(error, data)
    {
        if(error)
        {
            res.json({ message: error})
        }
        else
        {
            res.json(data);
        }
    })
})


//post APIs

server.post('/login', function(req, res)
{
    console.log(req.body.data.username, req.body.data.password);
    res.json({ message: "Received login credentials: " + req.body.data.username + " " + req.body.data.password });
});

//put APIs

server.options('/jokes', function(req, res)
{
    let sqlQuery = "CALL `updateJoke`(?, ?)";

    res.json({ id: req.body.data.id, joke: req.body.data.joke });
})

server.options('/jokesURL', function(req, res)
{
    let sqlQuery = "CALL `updateJoke`(?, ?)";

    res.json({ id: req.query.id, joke: req.query.joke });
})

server.options('/jokesparam/:id/:joke', function(req, res)
{
    let sqlQuery = "CALL `updateJoke`(?, ?)";

    res.json({ id: req.params.id, joke: req.params.joke });
})

server.options('/jokesnew/:id', function(req, res)
{
    let sqlQuery = "CALL `updateJoke`(?, ?)";

    res.json({ id: req.params.id, joke: req.body.data.joke });
})

server.options('/students1', function(req, res)
{
    res.json({ id: req.params.id, name: req.body.data.name })
})