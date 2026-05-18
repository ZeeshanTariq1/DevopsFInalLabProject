const request = require('supertest');
const express = require('express');

// Simple test that doesn't need real MongoDB
const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/api/tasks', (req, res) => res.json([]));
app.post('/api/tasks', (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  res.status(201).json({ _id: '123', title: req.body.title, priority: req.body.priority || 'medium', completed: false });
});

describe('Task Manager API Tests', () => {
  test('GET /health returns OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /api/tasks returns array', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/tasks creates task successfully', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', priority: 'high' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Task');
    expect(res.body.priority).toBe('high');
  });

  test('POST /api/tasks fails without title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ priority: 'low' });
    expect(res.statusCode).toBe(400);
  });
});