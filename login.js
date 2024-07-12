const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const crypto = require('crypto'); 

const app = express();
app.use(express.json());
app.use(cors());

const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = 'revankar@1208';
const DB_NAME = 'customer';
const JWT_SECRET = 'yourSuperSecretKey';
const RAZORPAY_KEY_ID = 'rzp_test_ybqxNC9dW5rcp0';
const RAZORPAY_KEY_SECRET = '2sP0tVvJQbvcnaV8uSSxOD72';

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database");
});

app.get('/', (req, res) => {
    res.send('Welcome to the Customer Registration API');
});

app.post('/api/register', (req, res) => {
    const { username, email, gender, password, address } = req.body;

    if (!username || !email || !gender || !password || !address) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const sql = 'INSERT INTO users (username, email, gender, password, address) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [username, email, gender, password, address], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            res.status(500).json({ error: 'Error registering user' });
            return;
        }
        console.log("User registered successfully", result);
        res.status(201).json({ message: 'User registered successfully' });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    });
});

app.post('/api/agent/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const sql = 'INSERT INTO agent (username, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            res.status(500).json({ error: 'Error registering agent' });
            return;
        }
        console.log("Agent registered successfully", result);
        res.status(201).json({ message: 'Agent registered successfully' });
    });
});

app.post('/api/agent/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    const sql = 'SELECT * FROM agent WHERE email = ?';
    connection.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const agent = results[0];
        const token = jwt.sign({ id: agent.id, email: agent.email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Agent Login successful', token });
    });
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.post('/api/bookings', authenticateJWT, (req, res) => {
    const { fullName, mobileNumber, email, hotelName, hotelAddress, hotelPrice, date, amount } = req.body;

    
    if (!fullName || !mobileNumber || !email || !hotelName || !hotelAddress || !hotelPrice || !date || !amount) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const userId = req.user.id; 

    
    const sql = 'INSERT INTO bookings (userId, fullName, mobileNumber, email, hotelName, hotelAddress, hotelPrice, date, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [userId, fullName, mobileNumber, email, hotelName, hotelAddress, hotelPrice, date, amount], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Error creating booking' });
        }
        console.log("Booking created successfully", result);
        res.status(201).json({ message: 'Booking created successfully' });
    });
});

app.get('/api/bookings', authenticateJWT, (req, res) => {
    const sql = `
        SELECT b.id, u.username as customerName, b.hotelName, b.hotelAddress, b.date, b.amount
        FROM bookings b
        INNER JOIN users u ON b.userId = u.id
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Error fetching bookings' });
        }
        res.json(results);
    });
});

// Razorpay Integration
const razorpay = new Razorpay({
    key_id: 'rzp_test_ybqxNC9dW5rcp0', 
    key_secret: '2sP0tVvJQbvcnaV8uSSxOD72' 
});

app.post('/api/bookings', authenticateJWT, (req, res) => {
    const { fullName, mobileNumber, email, hotelName, hotelAddress, hotelPrice, date, amount } = req.body;

    if (!fullName || !mobileNumber || !email || !hotelName || !hotelAddress || !hotelPrice || !date || !amount) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const userId = req.user.id;

    const sql = 'INSERT INTO bookings (userId, fullName, mobileNumber, email, hotelName, hotelAddress, hotelPrice, date, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [userId, fullName, mobileNumber, email, hotelName, hotelAddress, hotelPrice, date, amount], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Error creating booking' });
        }
        console.log("Booking created successfully", result);
        res.status(201).json({ message: 'Booking created successfully' });
    });
});

app.post('/api/createOrder', (req, res) => {
    const { amount } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
    }

    if (amount > 100000) {
        return res.status(400).json({
            statusCode: 400,
            error: {
                code: 'BAD_REQUEST_ERROR',
                description: 'Amount exceeds maximum amount allowed.',
                metadata: {},
                reason: 'NA',
                source: 'internal',
                step: 'NA'
            }
        });
    }

    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`
    };

    razorpay.orders.create(options, (err, order) => {
        if (err) {
            console.error("Error creating order:", err); 
            if (err && err.status) {
                return res.status(err.status).json({ error: err.error });
            }
            return res.status(500).json({ error: 'Error creating order', details: err });
        }
        res.status(201).json(order);
    });
});


app.post('/api/verifyPayment', authenticateJWT, (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest('hex');

    if (expectedSignature === razorpay_signature) {
        res.json({ status: "success" });
    } else {
        res.status(400).json({ status: "failure" });
    }
});

app.post('/api/processPayment', (req, res) => {
    const { amount, status, customer_id, card_last_4, payment_gateway_response } = req.body;

    if (!amount || !status || !customer_id || !card_last_4 || !payment_gateway_response) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = 'INSERT INTO transactions (amount, status, customer_id, card_last_4, payment_gateway_response) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [amount, status, customer_id, card_last_4, payment_gateway_response], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err.message);  
            console.error("SQL Query:", sql);  
            console.error("SQL Values:", [amount, status, customer_id, card_last_4, payment_gateway_response]);  
            return res.status(500).json({ error: 'Error processing payment' });
        }
        console.log("Payment processed successfully", result);
        res.status(201).json({ message: 'Payment processed successfully' });
    });
});

app.get('/api/transactions', authenticateJWT, (req, res) => {
    const sql = 'SELECT * FROM transactions';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: 'Error fetching transactions' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
