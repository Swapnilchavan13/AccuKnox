import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  "categories": [
    {
      "id": "1",
      "name": "CSPM Executive Dashboard",
      "widgets": [
        { "id": "1", "name": "Security Overview", "content": "Graph showing overall security metrics.", "status": true },
        { "id": "2", "name": "Compliance Status", "content": "Pie chart of compliance status across regions.", "status": true },
        { "id": "3", "name": "Threat Intelligence", "content": "Graph of threat intelligence updates.", "status": true },
        { "id": "4", "name": "Vulnerability Assessment", "content": "List of recent vulnerabilities found.", "status": true }
      ]
    },
    {
      "id": "2",
      "name": "CWPP Dashboard",
      "widgets": [
        { "id": "6", "name": "Threat Detection", "content": "Graph of detected threats by type.", "status": true },
        { "id": "7", "name": "Policy Compliance", "content": "Pie chart of policy compliance.", "status": true }
      ]
    },
    {
      "id": "3",
      "name": "Registry Scan",
      "widgets": [
        { "id": "11", "name": "Scan Results", "content": "Table of recent registry scan results.", "status": true },
        { "id": "12", "name": "Vulnerability Reports", "content": "List of vulnerabilities detected in scans.", "status": true }
      ]
    }
  ],
  "widgets": [
    { "id": "1", "name": "Security Overview", "content": "Graph showing overall security metrics.", "categoryId": "1", "status": true },
    { "id": "2", "name": "Compliance Status", "content": "Pie chart of compliance status across regions.", "categoryId": "1", "status": true },
    { "id": "3", "name": "Threat Intelligence", "content": "Graph of threat intelligence updates.", "categoryId": "1", "status": true },
    { "id": "4", "name": "Vulnerability Assessment", "content": "List of recent vulnerabilities found.", "categoryId": "1", "status": true },
    { "id": "6", "name": "Threat Detection", "content": "Graph of detected threats by type.", "categoryId": "2", "status": true },
    { "id": "7", "name": "Policy Compliance", "content": "Pie chart of policy compliance.", "categoryId": "2", "status": true },
    { "id": "11", "name": "Scan Results", "content": "Table of recent registry scan results.", "categoryId": "3", "status": true },
    { "id": "12", "name": "Vulnerability Reports", "content": "List of vulnerabilities detected in scans.", "categoryId": "3", "status": true }
  ]
}


const widgetSlice = createSlice({
  name: 'widgets',
  initialState,
  reducers: {
    addWidget: (state, action) => {
      const { categoryId, widget } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets.push(widget);
      }
    },
    removeWidget: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        category.widgets = category.widgets.filter(widget => widget.id !== widgetId);
      }
    },
    toggleWidgetStatus: (state, action) => {
      const { categoryId, widgetId } = action.payload;
      const category = state.categories.find(cat => cat.id === categoryId);
      if (category) {
        const widget = category.widgets.find(widget => widget.id === widgetId);
        if (widget) {
          widget.status = !widget.status;
        }
      }
    }
  }
});

export const { addWidget, removeWidget, toggleWidgetStatus } = widgetSlice.actions;

export default widgetSlice.reducer;
