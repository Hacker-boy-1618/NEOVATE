// Import necessary packages
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to parse JSON request bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// --- API ENDPOINTS ---

// 1. Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const { data, error } = await supabase.from('expenses').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    // Get the description, amount, and category from the request body
    const { description, amount, category } = req.body;

    // Basic validation
    if (!description || !amount) {
        return res.status(400).json({ error: 'Description and amount are required.' });
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{ description, amount, category }])
      .select(); // .select() returns the inserted row

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get all savings goals
app.get('/api/savings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('savings_goals').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
