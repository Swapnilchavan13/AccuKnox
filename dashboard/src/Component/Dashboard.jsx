import React, { useEffect, useState } from 'react';
import { useWidgetStore } from '../store/widgetStore';
import '../style/dashboard.css';

const Dashboard = () => {
  const {
    categories,
    addWidget,
    removeWidget,
    searchWidgets,
    setSelectedCategory,
    loadInitialData,
    toggleWidgetSelection,
    selectedWidgets,
    selectedCategory,
    searchResults,
    getUncheckedWidgets,
    updateWidgetStatus
  } = useWidgetStore((state) => ({
    categories: state.categories,
    addWidget: state.addWidget,
    removeWidget: state.removeWidget,
    searchWidgets: state.searchWidgets,
    setSelectedCategory: state.setSelectedCategory,
    loadInitialData: state.loadInitialData,
    toggleWidgetSelection: state.toggleWidgetSelection,
    selectedWidgets: state.selectedWidgets,
    selectedCategory: state.selectedCategory,
    searchResults: state.searchResults,
    getUncheckedWidgets: state.getUncheckedWidgets,
    updateWidgetStatus: state.updateWidgetStatus
  }));

  const [query, setQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupCategory, setPopupCategory] = useState(null);
  const [popupWidgets, setPopupWidgets] = useState([]);
  const [newWidget, setNewWidget] = useState({ name: '', content: '' });

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (popupCategory) {
      setPopupWidgets(getUncheckedWidgets());
    }
  }, [popupCategory, getUncheckedWidgets]);

  useEffect(() => {
    if (query === '') {
      setPopupWidgets(getUncheckedWidgets());
    } else {
      setPopupWidgets(searchResults);
    }
  }, [query, getUncheckedWidgets, searchResults]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    searchWidgets(e.target.value);
  };

  const handleCategorySelect = (categoryId) => {
    setPopupCategory(categoryId);
    setSelectedCategory(categoryId);
    setPopupWidgets(getUncheckedWidgets()); // Refresh widgets for the selected category
  };

  const handleConfirm = () => {
    if (popupCategory) {
      popupWidgets.forEach(widget => {
        if (widget.status) {
          addWidget(popupCategory, widget);
        } else {
          removeWidget(popupCategory, widget.id);
        }
      });
    }
    setShowPopup(false);
  };

  const handleWidgetSelect = (widgetId) => {
    const updatedWidgets = popupWidgets.map(widget => 
      widget.id === widgetId ? { ...widget, status: !widget.status } : widget
    );
    setPopupWidgets(updatedWidgets);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddNewWidget = () => {
    const widget = {
      id: Date.now(),
      name: newWidget.name,
      content: newWidget.content,
      categoryId: popupCategory,
      status: false // New widgets are initially unchecked
    };
    addWidget(popupCategory, widget);
    setNewWidget({ name: '', content: '' });
    setShowPopup(false);
  };

  return (
    <div className="dashboard-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search widgets..."
        />
        <button className="open-popup-button" onClick={() => setShowPopup(true)}>Add Widget</button>
      </div>
      <div className="grid-container">
        {categories.map(category => (
          <div key={category.id} className="category-container">
            <h2 className="h2tag">{category.name}</h2>
            <div className="widget-grid">
              {category.widgets
                .filter(widget => widget.status) // Show only checked widgets
                .map(widget => (
                <div key={widget.id} className="widget">
                  <span>{widget.name}</span>
                  <p>{widget.content}</p>
                  <button className="remove-button" onClick={() => removeWidget(category.id, widget.id)}>X</button>
                </div>
              ))}
              <button onClick={() => handleCategorySelect(category.id)}>Add Widget</button>
            </div>
          </div>
        ))}
      </div>
      {showPopup && (
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
              <>
                <div className="widget-selection">
                  {popupWidgets.map(widget => (
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
                <button className="add-widget-button" onClick={handleConfirm}>Confirm</button>
              </>
            )}
            <div className="add-new-widget">
              <h3>Add New Widget</h3>
              <input
                type="text"
                placeholder="Name"
                value={newWidget.name}
                onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Content"
                value={newWidget.content}
                onChange={(e) => setNewWidget({ ...newWidget, content: e.target.value })}
              />
              <button onClick={handleAddNewWidget}>Add Widget</button>
            </div>
            <button className="close-popup-button" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
