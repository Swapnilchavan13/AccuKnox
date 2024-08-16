import create from 'zustand';

const useWidgetStore = create((set, get) => ({
  categories: [],
  allWidgets: [],
  selectedCategory: null,
  selectedWidgets: [],
  searchResults: [],

  async loadInitialData() {
    try {
      const response = await fetch('/widgets.json');
      const data = await response.json();
      set({
        categories: data.categories,
        allWidgets: data.widgets.map(widget => ({ ...widget, status: widget.status || false })),
      });
    } catch (error) {
      console.error('Failed to load data', error);
    }
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

        return { categories: updatedCategories, allWidgets: updatedWidgets };
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

      return { categories: updatedCategories, allWidgets: updatedWidgets };
    });
  },

  updateWidgetStatus: (categoryId, widgetId, status) => {
    set(state => ({
      categories: state.categories.map(category =>
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
      )
    }));
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

      return { allWidgets: updatedWidgets, selectedWidgets };
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

      return { categories: updatedCategories, allWidgets: updatedWidgets };
    });
  },
}));

export { useWidgetStore };
