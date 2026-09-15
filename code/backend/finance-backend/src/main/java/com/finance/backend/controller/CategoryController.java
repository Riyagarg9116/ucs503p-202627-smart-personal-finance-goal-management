package com.finance.backend.controller;

import com.finance.backend.entity.Category;
import com.finance.backend.entity.User;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final UserService userService;

    public CategoryController(CategoryService categoryService,
                              UserService userService) {
        this.categoryService = categoryService;
        this.userService = userService;
    }

    // GET all categories
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // GET categories by user
    @GetMapping("/user/{userId}")
    public List<Category> getCategoriesByUser(
            @PathVariable Integer userId) {

        return categoryService.getCategoriesByUser(userId);
    }

    // GET category by ID
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Integer id) {

        return categoryService.getCategoryById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    // CREATE category
    @PostMapping("/user/{userId}")
    public Category createCategory(
            @PathVariable Integer userId,
            @RequestBody Category category) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        category.setUser(user);

        return categoryService.createCategory(category);
    }

    // UPDATE category
    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category) {

        return categoryService.updateCategory(id, category);
    }

    // DELETE category
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Integer id) {

        categoryService.deleteCategory(id);

        return "Category deleted successfully";
    }
}
