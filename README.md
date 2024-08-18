# Dynamic Dashboard Application

## Overview

This React application with Redux allows dynamic management of widgets within categories. It supports adding, removing, and toggling widgets, and maintains state persistence using `localStorage`.

## Features

- Add, remove, and toggle widgets.
- State persistence with `localStorage`.

## Technologies

- React
- Redux
- Redux Toolkit
- localStorage
 
## Getting Started

### Prerequisites

- Node.js

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Swapnilchavan13/AccuKnox
   cd dashboard

2. **Install dependencies:**
   ```bash
   npm install

3. **Running the Application:**
   ```bash
   npm start

4. **Code Structure:**

- App.js: Renders the Dashboard component.

- Dashboard.js: Manages widget display and interactions.

- store.js: Configures Redux store with localStorage integration.

- widgetSlice.js: Manages widget and category states.


5. **How It Works:**

- State Management: Uses Redux for state management.

- Persistence: Saves state to localStorage.

6. **Actions:**

- addWidget: Adds a widget to a category.

- removeWidget: Removes a widget from a category.

- toggleWidgetStatus: Toggles widget status.
