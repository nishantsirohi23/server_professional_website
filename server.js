// Import required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import CORS

// Initialize Express
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection string
const uri = 'mongodb+srv://nishant:sirohi123123@listofprofesionals.yabtc.mongodb.net/?retryWrites=true&w=majority&appName=listofprofesionals';

// MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB and handle requests
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    const database = client.db('listofprofesionals');
    const collection = database.collection('professionals');

    // POST route to add professional details
    app.post('/professionals', async (req, res) => {
      try {
        const { name, phone, email, category, agency, address } = req.body;

        if (!name || !phone || !email || !category || !address) {
          return res.status(400).json({ error: 'Name, phone, email, category, and address are required.' });
        }

        const professional = { name, phone, email, category, agency: !!agency, address };
        const result = await collection.insertOne(professional);
        res.status(201).json({ message: 'Professional added successfully', id: result.insertedId });
      } catch (error) {
        console.error('Error adding professional:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Health check route
    app.get('/', (req, res) => {
      res.send('Server is running.');
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
