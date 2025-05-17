const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Sports Equipment Store Server!')
})

app.listen(port, () => {
    console.log(`Sports Equipment Store Server is running on port ${port}`)
})


