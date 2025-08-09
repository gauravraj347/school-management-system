

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const pool = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', schoolRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;

// Test DB before starting server
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected');
    connection.release();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error(' Unable to connect to MySQL Database:', err.message);
    process.exit(1);
  }
})();
