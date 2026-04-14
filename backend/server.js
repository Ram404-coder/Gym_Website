// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('fitzone_db');
        console.log('✅ Connected to MongoDB Atlas');
        console.log('   Database: fitzone_db');
        
        const classCount = await db.collection('classes').countDocuments();
        console.log(`   📊 Classes in database: ${classCount}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
}

// ========================================
// API ROUTES
// ========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AuraAthletic API is running!',
        database: db ? 'Connected' : 'Not connected'
    });
});

// Get all classes
app.get('/api/classes', async (req, res) => {
    try {
        const classes = await db.collection('classes').find({}).toArray();
        res.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get single class by ID
app.get('/api/classes/:id', async (req, res) => {
    try {
        const classItem = await db.collection('classes').findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        if (!classItem) {
            return res.status(404).json({ error: 'Class not found' });
        }
        res.json(classItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ADMIN CLASS ROUTES
// ========================================

// Add a new class (admin)
app.post('/api/admin/classes', async (req, res) => {
    try {
        const newClass = {
            ...req.body,
            booked: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('classes').insertOne(newClass);
        res.status(201).json({ ...newClass, _id: result.insertedId });
    } catch (error) {
        console.error('Error creating class:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update a class (admin)
app.put('/api/admin/classes/:id', async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };
        const result = await db.collection('classes').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }
        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        console.error('Error updating class:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete a class (admin)
app.delete('/api/admin/classes/:id', async (req, res) => {
    try {
        const result = await db.collection('classes').deleteOne({ 
            _id: new ObjectId(req.params.id) 
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Class not found' });
        }
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// BOOKING ROUTES
// ========================================

// Get all bookings (for admin)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await db.collection('bookings').find({}).toArray();
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { classId, userName } = req.body;
        
        const classItem = await db.collection('classes').findOne({ 
            _id: new ObjectId(classId) 
        });
        
        if (!classItem) {
            return res.status(404).json({ error: 'Class not found' });
        }
        
        if (classItem.booked >= classItem.maxCapacity) {
            return res.status(400).json({ error: 'Class is full' });
        }
        
        const booking = {
            classId: new ObjectId(classId),
            userName: userName || 'Guest User',
            className: classItem.name,
            classDate: classItem.date,
            classTime: classItem.time,
            instructor: classItem.instructor,
            location: classItem.location,
            bookedAt: new Date(),
            status: 'confirmed'
        };
        
        const result = await db.collection('bookings').insertOne(booking);
        
        await db.collection('classes').updateOne(
            { _id: new ObjectId(classId) },
            { $inc: { booked: 1 } }
        );
        
        res.status(201).json({ message: 'Booking successful', bookingId: result.insertedId });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ error: error.message });
    }
});

// Cancel a booking
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await db.collection('bookings').findOne({ 
            _id: new ObjectId(req.params.id) 
        });
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        await db.collection('bookings').deleteOne({ _id: new ObjectId(req.params.id) });
        
        await db.collection('classes').updateOne(
            { _id: booking.classId },
            { $inc: { booked: -1 } }
        );
        
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// STATS ROUTES (FIXED - THIS WAS MISSING!)
// ========================================

// Get dashboard stats (admin)
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalClasses = await db.collection('classes').countDocuments();
        const totalBookings = await db.collection('bookings').countDocuments();
        const fullClasses = await db.collection('classes').countDocuments({
            $expr: { $gte: ["$booked", "$maxCapacity"] }
        });
        
        const allClasses = await db.collection('classes').find({}).toArray();
        const totalCapacity = allClasses.reduce((sum, c) => sum + c.maxCapacity, 0);
        const totalBooked = allClasses.reduce((sum, c) => sum + c.booked, 0);
        
        res.json({
            totalClasses,
            totalBookings,
            fullClasses,
            totalCapacity,
            totalBooked,
            utilizationRate: totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// TRAINER ROUTES
// ========================================

// Get all trainers
app.get('/api/trainers', async (req, res) => {
    try {
        const trainers = await db.collection('trainers').find({}).toArray();
        res.json(trainers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create trainer booking
app.post('/api/trainer-bookings', async (req, res) => {
    try {
        const booking = {
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };
        const result = await db.collection('trainer_bookings').insertOne(booking);
        res.status(201).json({ message: 'Booking request sent!', bookingId: result.insertedId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ========================================
// FRONTEND ROUTE
// ========================================

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ========================================
// START SERVER
// ========================================

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`\n🚀 AuraAthletic Server running on http://localhost:${PORT}`);
        console.log(`   API: http://localhost:${PORT}/api/classes`);
        console.log(`   Stats: http://localhost:${PORT}/api/admin/stats`);
        console.log(`   Bookings: http://localhost:${PORT}/api/bookings\n`);
    });
}

startServer();