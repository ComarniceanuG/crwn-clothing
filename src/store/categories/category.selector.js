import { createSelector } from 'reselect';

const selectCategoryReducer = state => state.categories;

export const selectCategories = createSelector(
  [selectCategoryReducer],
  categories => categories.categories
);

export const selectCategoriesMap = createSelector(
  [selectCategories],
  categories => 
    categories.reduce(
      (acc, { title, items }) => {
        acc[title.toLowerCase()] = items;
        return acc;
    }, {})
);

export const selectCategoriesIsLoading = createSelector(
  [selectCategoryReducer],
  categories => categories.isLoading
);