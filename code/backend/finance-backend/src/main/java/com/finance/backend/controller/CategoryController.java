package com.finance.backend.controller;

import com.finance.backend.entity.Category;
import com.finance.backend.entity.User;
import com.finance.backend.service.CategoryService;
import com.finance.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
    // Shows categories belonging to the current user
    // and global categories.
    @GetMapping
    public List<Category> getAllCategories() {

        User currentUser = getCurrentUser();

        return categoryService.getAllCategories()
                .stream()
                .filter(category ->
                        category.getUser() == null ||
                        (category.getUser().getUserId() != null &&
                         category.getUser().getUserId()
                                 .equals(currentUser.getUserId())))
                .toList();
    }

    // GET categories by user
    @GetMapping("/user/{userId}")
    public List<Category> getCategoriesByUser(
            @PathVariable Integer userId) {

        User currentUser = getCurrentUser();

        // User can only request their own user-specific categories
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own categories"
            );
        }

        return categoryService.getCategoriesByUser(userId);
    }

    // GET category by ID
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Category category = categoryService.getCategoryById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        // Global categories can be viewed by authenticated users.
        // User-specific categories can only be viewed by their owner.
        if (category.getUser() != null &&
                !category.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only access your own categories"
            );
        }

        return category;
    }

    // CREATE category
    @PostMapping("/user/{userId}")
    public Category createCategory(
            @PathVariable Integer userId,
            @RequestBody Category category) {

        User currentUser = getCurrentUser();

        // The URL userId must match the logged-in user
        if (!currentUser.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only create categories for yourself"
            );
        }

        // Always assign the authenticated user
        // instead of trusting the request body.
        category.setUser(currentUser);

        return categoryService.createCategory(category);
    }

    // UPDATE category
    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category) {

        User currentUser = getCurrentUser();

        Category existingCategory = categoryService
                .getCategoryById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        // Global categories cannot be modified by a normal user.
        if (existingCategory.getUser() == null ||
                !existingCategory.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only update your own categories"
            );
        }

        // Prevent changing category ownership.
        category.setUser(currentUser);

        return categoryService.updateCategory(id, category);
    }

    // DELETE category
    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Integer id) {

        User currentUser = getCurrentUser();

        Category existingCategory = categoryService
                .getCategoryById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));

        // Global categories and other users' categories cannot be deleted.
        if (existingCategory.getUser() == null ||
                !existingCategory.getUser().getUserId()
                        .equals(currentUser.getUserId())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own categories"
            );
        }

        categoryService.deleteCategory(id);

        return "Category deleted successfully";
    }

    // Get currently logged-in user from JWT
    private User getCurrentUser() {

        return userService.getCurrentUser()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User is not authenticated"
                ));
    }
}
