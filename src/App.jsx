import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteAllConfirmation, setDeleteAllConfirmation] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addTask = () => {
    if (inputValue.trim() !== '') {
      const currentDate = new Date().toLocaleString();
      setTasks([...tasks, { id: Date.now(), text: inputValue, created: currentDate, completed: false }]);
      setInputValue('');
    }
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const prepareDelete = (taskId) => {
    setTaskToDelete(taskId);
  };

  const confirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== taskToDelete));
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  const completeAll = () => {
    const updatedTasks = tasks.map(task => ({
      ...task,
      completed: true
    }));
    setCompletedTasks([...tasks]);
    setTasks(updatedTasks);
    setShowUndo(true);
  };

  const undoCompleteAll = () => {
    setTasks([...completedTasks]);
    setCompletedTasks([]);
    setShowUndo(false);
  };

  const handleDeleteAllConfirmation = () => {
    setDeleteAllConfirmation(true);
  };

  const confirmDeleteAll = () => {
    setTasks([]);
    setDeleteAllConfirmation(false);
  };

  const cancelDeleteAll = () => {
    setDeleteAllConfirmation(false);
  };

  const openEditModal = (taskId, text) => {
    setEditTaskId(taskId);
    setEditTaskText(text);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditTaskId(null);
    setEditTaskText('');
    setShowEditModal(false);
  };

  const handleEditInputChange = (e) => {
    setEditTaskText(e.target.value);
  };

  const handleEditTask = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, text: editTaskText };
      }
      return task;
    });
    setTasks(updatedTasks);
    closeEditModal();
  };

  return (
    <div className="container custom-container">
      <div className="navbar custom-navbar">
        <h1 className="text-center navtext">To-Do</h1>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new task"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="btn add-button" type="button" onClick={addTask}>
          Add
        </button>
      </div>
      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item  ${task.completed ? 'bg-custom text-light' : ''}`}
          >
            <div className="task-container">
              <div>
                <span className="task-text" onClick={() => toggleComplete(task.id)} style={{ cursor: 'pointer' }}>{task.text}</span>
              </div>
              <div>
                <small className="text-muted created-time">{task.created}</small>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn edit-button"
                onClick={() => openEditModal(task.id, task.text)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                type="button"
                className="btn delete-button"
                onClick={() => prepareDelete(task.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Task Modal */}
      <div className="modal custom-modal-container" style={{ display: showEditModal ? 'flex' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content custom-modal-content">
            <div className="modal-header custom-modal-header">
              <h5 className="modal-title">Edit Task</h5>
              <button type="button" className="btn-close" onClick={closeEditModal}></button>
            </div>
            <div className="modal-body custom-modal-body">
              <input
                type="text"
                className="form-control"
                value={editTaskText}
                onChange={handleEditInputChange}
              />
            </div>
            <div className="modal-footer custom-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
              <button type="button" className="btn save-button" onClick={() => handleEditTask(editTaskId)}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
      {/* End Edit Task Modal */}

      {/* Complete All and Delete All Buttons */}
      <div className="mt-3">
        {!showUndo && <button className="btn complete-all-button" onClick={completeAll}>Complete All</button>}
        {showUndo && <button className="btn undo-complete-all-button" onClick={undoCompleteAll}>Undo</button>}
        <button className="btn delete-all-button" onClick={handleDeleteAllConfirmation}>Delete All</button>
      </div>
      {/* End Complete All and Delete All Buttons */}

      {/* Delete All Confirmation Modal */}
      <div className="modal custom-modal-container" style={{ display: deleteAllConfirmation ? 'flex' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content custom-modal-content">
            <div className="modal-header custom-modal-header">
              <h5 className="modal-title">Confirmation</h5>
              <button type="button" className="btn-close" onClick={cancelDeleteAll}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete all tasks?
            </div>
            <div className="modal-footer custom-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDeleteAll}>Cancel</button>
              <button type="button" className="btn del-button" onClick={confirmDeleteAll}>Delete All</button>
            </div>
          </div>
        </div>
      </div>
      {/* End Delete All Confirmation Modal */}

      {/* Delete Confirmation Modal */}
      <div className="modal custom-modal-container" style={{ display: taskToDelete !== null ? 'flex' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content custom-modal-content">
            <div className="modal-header custom-modal-header">
              <h5 className="modal-title">Confirmation</h5>
              <button type="button" className="btn-close" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this task?
            </div>
            <div className="modal-footer custom-modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
              <button type="button" className="btn del-button" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
      {/* End Delete Confirmation Modal */}
    </div>
  );
}

export default App;
