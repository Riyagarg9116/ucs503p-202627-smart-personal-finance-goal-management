package com.finance.backend.service;

import com.finance.backend.entity.Category;
import com.finance.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Integer id) {
        return categoryRepository.findById(id);
    }

    // Get categories of a particular user
    public List<Category> getCategoriesByUser(Integer userId) {
        return categoryRepository.findByUserUserId(userId);
    }

    // Create category
    
public Category createCategory(Category category) {
    validateCategory(category);
    category.setCategoryName(category.getCategoryName().trim());
    category.setCategoryType(category.getCategoryType().trim());

    return categoryRepository.save(category);
}


    // Update category
    
public Category updateCategory(
        Integer id, Category categoryDetails) {

    validateCategory(categoryDetails);

    Category category = categoryRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Category not found"));

    category.setCategoryName(
            categoryDetails.getCategoryName().trim());
    category.setCategoryType(
            categoryDetails.getCategoryType().trim());

    return categoryRepository.save(category);
}


    // Delete category
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    
private void validateCategory(Category category) {
    if (category == null) {
        throw new IllegalArgumentException(
                "Category cannot be empty");
    }

    if (category.getCategoryName() == null
            || category.getCategoryName().isBlank()) {
        throw new IllegalArgumentException(
                "Category name cannot be blank");
    }

    if (category.getCategoryType() == null
            || category.getCategoryType().isBlank()) {
        throw new IllegalArgumentException(
                "Category type cannot be blank");
    }
}

}
