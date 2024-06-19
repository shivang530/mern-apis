const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());
const key = 'secretKey';
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@cladminuster0.bw8nflv.mongodb.net/userDb?retryWrites=true&w=majority');

const User = mongoose.model('Users', { name: String,email:String,password:String });

const user = new User({ name: 'Zildjian',email:'tzirw@example.com',password:'password' });
    user.save().then(() => console.log('meow'));


const userList = [
    {name: 'shivang', password: '123456'},
    {name: 'shivang123', password: '123456789'},
    {name: 'shivang321', password: '123456987'}
];

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/', (req, res) => res.json({name: 'John'}));

const userValid = (username, password) => {
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].name === username && userList[i].password === password) {
            return true;
        }
    }
    return false;
};

app.post('/login', (req, res) => {
    console.log('Request body:', req.body); // Log the request body to debug
    const { username, password } = req.body;
    console.log('Received credentials:', { username, password }); // Log received credentials

    if (!userValid(username, password)) {
        console.log('Invalid credentials:', { username, password }); // Log invalid credentials
        return res.json({message: 'Invalid Credentials'});
    }

    const token = jwt.sign({ username: username }, key);
    console.log('Token generated:', token); // Log generated token

    return res.json({ token: token });
});

app.get('/users', (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decrypt = jwt.verify(token, key);
        const username = decrypt.username;
        const filteredUsers = userList.filter(user => user.name !== username);
        res.json(filteredUsers);
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.listen(3000, () => console.log(`Example app listening at http://localhost:3000`));
