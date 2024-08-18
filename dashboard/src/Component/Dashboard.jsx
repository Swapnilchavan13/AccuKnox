import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../style/dashboard.css';
import { addWidget, removeWidget, toggleWidgetStatus } from '../store/widgetSlice';

const Dashboard = () => {
  const categories = useSelector(state => state.widgets.categories);
  const dispatch = useDispatch();

  const [query, setQuery] = useState('');
  const [showWidgetPopup, setShowWidgetPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [popupCategory, setPopupCategory] = useState(null);
  const [newWidget, setNewWidget] = useState({ name: '', content: '' });

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);
  };

  const handleCategorySelect = (categoryId) => {
    setPopupCategory(categoryId);
  };

  const handleConfirm = () => {
    setShowWidgetPopup(false);
  };

  const handleWidgetSelect = (widgetId) => {
    dispatch(toggleWidgetStatus({ categoryId: popupCategory, widgetId }));
  };

  const handleClosePopup = () => {
    setShowWidgetPopup(false);
    setShowCategoryPopup(false);
  };

  const handleAddNewWidget = () => {
    if (!popupCategory) return;

    const widget = {
      id: Date.now(),
      name: newWidget.name,
      content: newWidget.content,
      status: true,
    };

    dispatch(addWidget({ categoryId: popupCategory, widget }));

    setNewWidget({ name: '', content: '' });
    setShowCategoryPopup(false);
  };

  return (
    <div className="dashboard-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="🔍 Search widgets..."
        />
      </div>
      <div className="grid-container">
        <div className="dash">
          <h1>CNAPP Dashboard</h1>
          <button className="open-popup-button" onClick={() => setShowWidgetPopup(true)}>Add Widget +</button>
        </div>

        {categories.map(category => (
          <div key={category.id} className="category-container">
            <h2 className="h2tag">{category.name}</h2>
            <div className="widget-grid">
              {category.widgets
                .filter(widget => widget.status && widget.name.toLowerCase().includes(query))
                .map(widget => (
                  <div key={widget.id} className="widget">
                    <h3>{widget.name}</h3>
                    <div className='idiv'>
                      <img style={{width:'100px'}} src="https://images.nagwa.com/figures/explainers/245194820905/4.svg" alt="" />
                      <p>{widget.content}</p>
                      </div>
                    <button
                      className="remove-button"
                      onClick={() => dispatch(removeWidget({ categoryId: category.id, widgetId: widget.id }))}
                    >
                      X
                    </button>
                  </div>
                ))}
              <div className="btndiv">
                <button onClick={() => setShowCategoryPopup(true)}>+ Add New</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup for adding existing widgets */}
      {showWidgetPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Select Widgets</h2>
            <div className="category-selection">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`category-item ${popupCategory === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>

            {popupCategory && (
              <div className="widget-selection">
                {categories.find(cat => cat.id === popupCategory).widgets.map(widget => (
                  <div
                    key={widget.id}
                    className={`widget-item ${widget.status ? 'selected' : ''}`}
                    onClick={() => handleWidgetSelect(widget.id)}
                  >
                    <input
                      type="checkbox"
                      checked={widget.status}
                      onChange={() => handleWidgetSelect(widget.id)}
                    />
                    <span>{widget.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="close-popup-button" onClick={handleClosePopup}>Close</button>
            <button className="add-widget-button" onClick={handleConfirm}>Confirm</button>
          </div>
        </div>
      )}

      {/* Popup for adding new widget to a specific category */}
      {showCategoryPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Add New Widget</h2>
            <div className="category-selection">
              {categories.map(category => (
                <div
                  key={category.id}
                  className={`category-item ${popupCategory === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </div>
              ))}
            </div>

            {popupCategory && (
              <div className="add-new-widget">
                <input
                  type="text"
                  placeholder="Widget Name"
                  value={newWidget.name}
                  onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
                />
                <br />
                <br />
                <input
                  type="text"
                  placeholder="Widget Content"
                  value={newWidget.content}
                  onChange={(e) => setNewWidget({ ...newWidget, content: e.target.value })}
                />
                <br />
                <br />
                <button className="add-widget-button" onClick={handleAddNewWidget}>Add Widget</button>
              </div>
            )}
            <button className="close-popup-button" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
