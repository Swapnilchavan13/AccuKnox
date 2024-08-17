import create from 'zustand';

const useWidgetStore = create((set, get) => ({
  categories: [],
  allWidgets: [],
  selectedCategory: null,
  selectedWidgets: [],
  searchResults: [],

  // Load data from localStorage or fetch from API if not available
  async loadInitialData() {
    try {
      const localData = localStorage.getItem('widgetStore');
      if (localData) {
        const data = JSON.parse(localData);
        set({
          categories: data.categories || [],
          allWidgets: data.allWidgets || [],
        });
      } else {
        const response = await fetch('/widgets.json');
        const data = await response.json();
        set({
          categories: data.categories || [],
          allWidgets: data.widgets.map(widget => ({ ...widget, status: widget.status || false })) || [],
        });
        localStorage.setItem('widgetStore', JSON.stringify({
          categories: data.categories,
          allWidgets: data.widgets.map(widget => ({ ...widget, status: widget.status || false })),
        }));
      }
    } catch (error) {
      console.error('Failed to load data', error);
    }
  },

  // Save state to localStorage
  saveToLocalStorage() {
    const { categories, allWidgets } = get();
    localStorage.setItem('widgetStore', JSON.stringify({
      categories,
      allWidgets,
    }));
  },

  setSelectedCategory(categoryId) {
    set({ selectedCategory: categoryId });
  },

  getAvailableWidgets() {
    const { selectedCategory, allWidgets } = get();
    return allWidgets.filter(widget => widget.categoryId === selectedCategory);
  },

  addWidget(categoryId, widget) {
    set((state) => {
      const existingWidget = state.allWidgets.find(w => w.id === widget.id);

      if (!existingWidget) {
        const updatedCategories = state.categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              widgets: [...category.widgets, widget],
            };
          }
          return category;
        });

        const updatedWidgets = [...state.allWidgets, { ...widget, status: widget.status || false }];

        const newState = { categories: updatedCategories, allWidgets: updatedWidgets };
        set(newState);
        state.saveToLocalStorage(); // Save the updated state
        return newState;
      }

      return state;
    });
  },

  removeWidget(categoryId, widgetId) {
    set((state) => {
      const updatedCategories = state.categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            widgets: category.widgets.filter(widget => widget.id !== widgetId),
          };
        }
        return category;
      });

      const updatedWidgets = state.allWidgets.filter(widget => widget.id !== widgetId);

      const newState = { categories: updatedCategories, allWidgets: updatedWidgets };
      set(newState);
      state.saveToLocalStorage(); // Save the updated state
      return newState;
    });
  },

  updateWidgetStatus: (categoryId, widgetId, status) => {
    set(state => {
      const updatedCategories = state.categories.map(category =>
        category.id === categoryId
          ? {
              ...category,
              widgets: category.widgets.map(widget =>
                widget.id === widgetId
                  ? { ...widget, status }
                  : widget
              )
            }
          : category
      );

      const newState = { categories: updatedCategories };
      set(newState);
      state.saveToLocalStorage(); // Save the updated state
      return newState;
    });
  },

  searchWidgets(query) {
    set((state) => ({
      searchResults: state.allWidgets.filter(widget => widget.name.toLowerCase().includes(query.toLowerCase()))
    }));
  },

  toggleWidgetSelection(widgetId) {
    set((state) => {
      const updatedWidgets = state.allWidgets.map(w =>
        w.id === widgetId ? { ...w, status: !w.status } : w
      );

      const selectedWidgets = updatedWidgets.filter(w => w.status);

      const newState = { allWidgets: updatedWidgets, selectedWidgets };
      set(newState);
      state.saveToLocalStorage(); // Save the updated state
      return newState;
    });
  },

  getCheckedWidgets() {
    return get().selectedWidgets;
  },

  getUncheckedWidgets() {
    const { selectedCategory, allWidgets } = get();
    return allWidgets
      .filter(widget => widget.categoryId === selectedCategory)
      .map(widget => ({
        ...widget,
        status: widget.status // Use the status from the widget
      }));
  },

  addNewWidget(categoryId, widget) {
    set((state) => {
      const updatedCategories = state.categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            widgets: [...category.widgets, widget],
          };
        }
        return category;
      });

      const updatedWidgets = [...state.allWidgets, { ...widget, status: false }];

      const newState = { categories: updatedCategories, allWidgets: updatedWidgets };
      set(newState);
      state.saveToLocalStorage(); // Save the updated state
      return newState;
    });
  },
}));

export { useWidgetStore };
