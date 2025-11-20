import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import TaskForm from '../components/TaskForm';

const TaskEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getById(id);
      setTask(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError('');
      setSuccess('');
      
      if (isEditing) {
        await tasksAPI.update(id, formData);
        setSuccess('Task updated successfully!');
      } else {
        await tasksAPI.create(formData);
        setSuccess('Task created successfully!');
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
};

export default TaskEdit;
