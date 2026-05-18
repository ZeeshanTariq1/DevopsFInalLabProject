// This script runs automatically when MongoDB container first starts
db = db.getSiblingDB('taskmanager');

db.createCollection('tasks');

// Insert sample tasks so the app looks populated on first run
db.tasks.insertMany([
  {
    title: 'Setup Docker containers',
    priority: 'high',
    completed: true,
    createdAt: new Date()
  },
  {
    title: 'Configure Kubernetes on AKS',
    priority: 'high',
    completed: false,
    createdAt: new Date()
  },
  {
    title: 'Write Selenium tests',
    priority: 'medium',
    completed: false,
    createdAt: new Date()
  },
  {
    title: 'Setup GitHub Actions CI/CD',
    priority: 'high',
    completed: false,
    createdAt: new Date()
  }
]);

print('✅ Database initialized with sample tasks');