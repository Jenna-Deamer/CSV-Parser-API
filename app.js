const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/uploadRoute');

const app = express();
const port = process.env.PORT || 3000;

// enabling CORS for some specific origins only.
let corsOptions = { origin: ['http://localhost:5173'], };
app.use(cors(corsOptions)); // Enable CORS with specified options
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');  
});

app.use('/api', uploadRoute);

app.listen(port, () => console.log(`Server listening on port ${port}`));