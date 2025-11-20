import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    status: '',
    search: ''
  });
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getAll(filters);
      setTasks(response.data.data);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(id);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage
    });
  };

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>{isAdmin ? 'All Tasks' : 'My Tasks'}</h2>
        <button onClick={() => navigate('/tasks/new')} className="btn btn-primary">
          + Create Task
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select
            name="status"
            className="form-control"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
          <button onClick={() => navigate('/tasks/new')} className="btn btn-primary">
            Create Task
          </button>
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDelete} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
