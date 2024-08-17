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
    searchResults,
    getUncheckedWidgets,
    refreshPopupWidgets
  } = useWidgetStore((state) => ({
    categories: state.categories,
    addWidget: state.addWidget,
    removeWidget: state.removeWidget,
    searchWidgets: state.searchWidgets,
    setSelectedCategory: state.setSelectedCategory,
    loadInitialData: state.loadInitialData,
    toggleWidgetSelection: state.toggleWidgetSelection,
    searchResults: state.searchResults,
    getUncheckedWidgets: state.getUncheckedWidgets,
    refreshPopupWidgets: state.refreshPopupWidgets
  }));

  const [query, setQuery] = useState('');
  const [showWidgetPopup, setShowWidgetPopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [popupCategory, setPopupCategory] = useState(null);
  const [popupWidgets, setPopupWidgets] = useState([]);
  const [newWidget, setNewWidget] = useState({ name: '', content: '' });

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (popupCategory) {
      if (query === '') {
        setPopupWidgets(getUncheckedWidgets(popupCategory));
      } else {
        setPopupWidgets(searchResults.filter(widget => widget.categoryId === popupCategory));
      }
    }
  }, [popupCategory, query, searchResults, getUncheckedWidgets]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    searchWidgets(searchTerm);
  };

  const handleCategorySelect = (categoryId) => {
    setPopupCategory(categoryId);
    setSelectedCategory(categoryId);
    if (query === '') {
      setPopupWidgets(getUncheckedWidgets(categoryId));
    } else {
      searchWidgets(query);
    }
  };

  const handleConfirm = () => {
    if (popupCategory) {
      const widgetsToAdd = popupWidgets.filter(widget => widget.status);
      const widgetsToRemove = popupWidgets.filter(widget => !widget.status);

      widgetsToAdd.forEach(widget => addWidget(popupCategory, widget));
      widgetsToRemove.forEach(widget => removeWidget(popupCategory, widget.id));
    }
    setShowWidgetPopup(false);
  };

  const handleWidgetSelect = (widgetId) => {
    const updatedWidgets = popupWidgets.map(widget =>
      widget.id === widgetId ? { ...widget, status: !widget.status } : widget
    );
    setPopupWidgets(updatedWidgets);
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
      categoryId: popupCategory,
      status: true,
    };

    addWidget(popupCategory, widget);

    setPopupWidgets(prevWidgets => [...prevWidgets, widget]);

    setNewWidget({ name: '', content: '' });
    setShowCategoryPopup(false);
  };

  useEffect(() => {
    if (popupCategory) {
      refreshPopupWidgets(popupCategory);
    }
  }, [removeWidget, refreshPopupWidgets]);

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

        {query ? (
          categories.map(category => {
            const filteredWidgets = searchResults.filter(widget => widget.categoryId === category.id);
            return filteredWidgets.length > 0 && (
              <div key={category.id} className="category-container">
                <h2 className="h2tag">{category.name}</h2>
                <div className="widget-grid">
                  {filteredWidgets.map(widget => (
                    <div key={widget.id} className="widget">
                      <span><h3>{widget.name}</h3></span>
                      <p>{widget.content}</p>
                      <button className="remove-button" onClick={() => removeWidget(widget.categoryId, widget.id)}>X</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          categories.map(category => (
            <div key={category.id} className="category-container">
              <h2 className="h2tag">{category.name}</h2>
              <div className="widget-grid">
                {category.widgets
                  .filter(widget => widget.status)
                  .map(widget => (
                    <div key={widget.id} className="widget">
                      <span><h3>{widget.name}</h3></span>
                      <p>{widget.content}</p>
                      <button className="remove-button" onClick={() => removeWidget(category.id, widget.id)}>X</button>
                    </div>
                  ))}
                <div className="btndiv">
                  <button onClick={() => setShowCategoryPopup(true)}>+ Add New</button>
                </div>
              </div>
            </div>
          ))
        )}
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
                {popupWidgets.length > 0 ? (
                  popupWidgets.map(widget => (
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
                  ))
                ) : (
                  <p>No widgets available for this category.</p>
                )}
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
                <button onClick={handleAddNewWidget}>Add Widget</button>
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
