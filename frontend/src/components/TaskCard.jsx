import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onDelete }) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const canEdit = task.createdBy._id === user._id;
  const canDelete = canEdit || isAdmin;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
        </div>
        <span className={`task-status ${task.status}`}>{task.status}</span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <span>Created by: {task.createdBy.name}</span>
        <span>Created: {formatDate(task.createdAt)}</span>
        {task.updatedAt !== task.createdAt && (
          <span>Updated: {formatDate(task.updatedAt)}</span>
        )}
      </div>
      
      <div className="task-actions">
        {canEdit && (
          <button
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
            className="btn btn-primary btn-sm"
          >
            Edit
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="btn btn-danger btn-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
