const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
}));

app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mshyek002$$',
    database: 'queuesystem'
});

app.post('/addpatient', async (req, res) => {
    const {
        first_name,
        last_name,
        dob,
        address,
        phone_number,
        symptoms ,
        temperature      
    } = req.body;

    try {
        const unique_number = Math.floor(Math.random() * 10000);

        // Get the maximum current position
        const [rowsMaxPos] = await pool.query('SELECT MAX(position) as maxPos FROM queue');
        const maxPos = rowsMaxPos[0].maxPos || 0; // If no records, maxPos will be null, thus default to 0

        // Add new record with incremented position
        const [rows] = await pool.query(`INSERT INTO queue (first_name, last_name, dob, address, phone_number, symptoms, temperature, unique_number, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [first_name, last_name, dob, address, phone_number, symptoms, temperature, unique_number, maxPos + 1]);

        if (rows.affectedRows === 1) {
            res.status(200).send({
                'status': 'OK',
                'unique_number': unique_number
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            'status': 'error',
            'details': err
        });
    }
});

app.get('/queue', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM queue order by position desc');

        res.status(200).send({
            'status': 'OK',
            'data': rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            'status': 'error',
            'details': err
        });
    }
});

app.post('/increasePosition', async (req, res) => {
    const {
        unique_number
    } = req.body;

    const conn = await pool.getConnection();

    try {
        // set transaction isolation level to SERIALISABLE
        await conn.query(`SET TRANSACTION ISOLATION LEVEL SERIALISABLE`);

        await conn.beginTransaction();

        // Get the current position of the target row
        const [rowsPos] = await conn.query(`SELECT position FROM queue WHERE unique_number = ? FOR UPDATE`, [unique_number]);

        if (rowsPos.length === 0) {
            throw new Error(`No patient found with unique number ${unique_number}.`);
        }

        const currentPos = rowsPos[0].position;

        // Get the row that has the position value of the current position + 1
        const [rowsNext] = await conn.query(`SELECT unique_number FROM queue WHERE position = ? FOR UPDATE`, [currentPos + 1]);

        if (rowsNext.length === 0) {
            throw new Error(`No patient found with position ${currentPos + 1}.`);
        }

        const nextUniqueNumber = rowsNext[0].unique_number;

        // Increment the position of the current row
        await conn.query(`UPDATE queue SET position = position + 1 WHERE unique_number = ?`, [unique_number]);

        // Decrement the position of the next row
        await conn.query(`UPDATE queue SET position = position - 1 WHERE unique_number = ?`, [nextUniqueNumber]);

        await conn.commit();

        res.status(200).send({
            'status': 'OK',
            'details': `Position of patient with unique number ${unique_number} increased successfully.`
        });
    } catch (err) {
        await conn.rollback();
        console.log(err);
        res.status(500).send({
            'status': 'error',
            'details': err.message
        });
    } finally {
        conn.release();
    }
});
// DELETE endpoint
app.post('/deletePatient', async (req, res) => {
    const {
        unique_number
    } = req.body;

    const conn = await pool.getConnection();

    try {
        // set transaction isolation level to SERIALIZABLE
        await conn.query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`);

        await conn.beginTransaction();

        // Get the current position of the target row
        const [rowsPos] = await conn.query(`SELECT position FROM queue WHERE unique_number = ? FOR UPDATE`, [unique_number]);

        if (rowsPos.length === 0) {
            throw new Error(`No patient found with unique number ${unique_number}.`);
        }

        const currentPos = rowsPos[0].position;

        // Delete the patient with the provided unique_number
        await conn.query(`DELETE FROM queue WHERE unique_number = ?`, [unique_number]);

        // Adjust the position of all the patients that were behind the deleted one
        await conn.query(`UPDATE queue SET position = position - 1 WHERE position > ?`, [currentPos]);

        await conn.commit();

        res.status(200).send({
            'status': 'OK',
            'details': `Patient with unique number ${unique_number} deleted successfully.`
        });
    } catch (err) {
        await conn.rollback();
        console.log(err);
        res.status(500).send({
            'status': 'error',
            'details': err.message
        });
    } finally {
        conn.release();
    }
});

const user = { staffId: "123", password: "password" };

// Login route
app.post('/login', (req, res) => {
  const { staffId, password } = req.body;

  if (staffId === user.staffId && password === user.password) {
    res.status(200).json({ status: 'OK', message: 'Login successful!' });
  } else {
    res.status(401).json({ status: 'FAILED', message: 'Invalid login credentials.' });
  }
});

// Listen
app.listen(3003, () => {
  console.log('Server running on http://localhost:3003/');
});
