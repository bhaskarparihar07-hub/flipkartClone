import {
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    CLEAR_ERRORS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    SLIDER_PRODUCTS_REQUEST,
    SLIDER_PRODUCTS_SUCCESS,
    SLIDER_PRODUCTS_FAIL,
} from "../constants/productConstants";
import {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    addProduct as addProductToDB,
    updateProduct as updateProductInDB,
    deleteProduct as deleteProductFromDB
} from '../utils/indexedDB';

// Get All Products --- Filter/Search/Sort
export const getProducts =
    (keyword = "", category, price = [0, 200000], ratings = 0, currentPage = 1) => async (dispatch) => {
        try {
            dispatch({ type: ALL_PRODUCTS_REQUEST });

            // Use IndexedDB instead of API
            let products = await searchProducts(keyword, category, price, ratings);

            // Simple pagination
            const resultPerPage = 12;
            const startIndex = (currentPage - 1) * resultPerPage;
            const endIndex = startIndex + resultPerPage;
            const paginatedProducts = products.slice(startIndex, endIndex);

            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: {
                    products: paginatedProducts,
                    productsCount: products.length,
                    resultPerPage,
                    filteredProductsCount: products.length
                },
            });
        } catch (error) {
            dispatch({
                type: ALL_PRODUCTS_FAIL,
                payload: error.message,
            });
        }
    };

// Get All Products Of Same Category
export const getSimilarProducts = (category) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST });

        const products = await getProductsByCategory(category);

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: {
                products,
                productsCount: products.length,
                resultPerPage: 12,
                filteredProductsCount: products.length
            },
        });
    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.message,
        });
    }
};

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        let product = await getProductById(id);

        // If product not found, create a placeholder "Out of Stock" product
        if (!product) {
            // Try to extract category from URL or use default
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category') || 'Electronics';

            product = {
                _id: id,
                name: "Product Currently Unavailable",
                description: "This product is currently out of stock or unavailable. Please check back later or browse similar products.",
                highlights: ["Currently unavailable", "Check back soon"],
                specifications: [
                    { title: "Status", description: "Out of Stock" }
                ],
                price: 0,
                cuttedPrice: 0,
                images: [{
                    public_id: "placeholder",
                    url: "https://via.placeholder.com/400x400?text=Out+of+Stock"
                }],
                brand: {
                    name: "N/A",
                    logo: {
                        public_id: "placeholder",
                        url: "https://via.placeholder.com/100x50?text=Brand"
                    }
                },
                category: category,
                stock: 0, // Out of stock
                warranty: 0,
                ratings: 0,
                numOfReviews: 0,
                reviews: []
            };
        }

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: product,
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.message,
        });
    }
};

// New/Update Review
export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });

        // Get product from IndexedDB
        const product = await getProductById(reviewData.productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Add review to product
        const newReview = {
            user: reviewData.userId || 'user-' + Date.now(),
            name: reviewData.name || 'Anonymous',
            rating: reviewData.rating,
            comment: reviewData.comment
        };

        product.reviews = product.reviews || [];
        product.reviews.push(newReview);
        product.numOfReviews = product.reviews.length;

        // Recalculate average rating
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        product.ratings = totalRating / product.reviews.length;

        // Update in IndexedDB
        await updateProductInDB(product);

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: true,
        });
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.message,
        });
    }
}

// Get All Products ---PRODUCT SLIDER
export const getSliderProducts = () => async (dispatch) => {
    try {
        dispatch({ type: SLIDER_PRODUCTS_REQUEST });

        const products = await getAllProducts();

        dispatch({
            type: SLIDER_PRODUCTS_SUCCESS,
            payload: products,
        });
    } catch (error) {
        dispatch({
            type: SLIDER_PRODUCTS_FAIL,
            payload: error.message,
        });
    }
};

// Get All Products ---ADMIN
export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST });

        const products = await getAllProducts();

        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: products,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.message,
        });
    }
};

// New Product ---ADMIN
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });

        // Generate new product with ID
        const newProduct = {
            ...productData,
            _id: 'product-' + Date.now(),
            ratings: 0,
            numOfReviews: 0,
            reviews: []
        };

        await addProductToDB(newProduct);

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: {
                success: true,
                product: newProduct
            },
        });
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.message,
        });
    }
}

// Update Product ---ADMIN
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const product = await getProductById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        const updatedProduct = {
            ...product,
            ...productData
        };

        await updateProductInDB(updatedProduct);

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: true,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.message,
        });
    }
}

// Delete Product ---ADMIN
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        await deleteProductFromDB(id);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: true,
        });
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.message,
        });
    }
}

// Get Product Reviews ---ADMIN
export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_REVIEWS_REQUEST });

        const product = await getProductById(id);

        if (!product) {
            throw new Error('Product not found');
        }

        dispatch({
            type: ALL_REVIEWS_SUCCESS,
            payload: product.reviews || [],
        });
    } catch (error) {
        dispatch({
            type: ALL_REVIEWS_FAIL,
            payload: error.message,
        });
    }
}

// Delete Product Review ---ADMIN
export const deleteReview = (reviewId, productId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });

        const product = await getProductById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Remove review
        product.reviews = product.reviews.filter((_, index) => index !== parseInt(reviewId));
        product.numOfReviews = product.reviews.length;

        // Recalculate rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
            product.ratings = totalRating / product.reviews.length;
        } else {
            product.ratings = 0;
        }

        await updateProductInDB(product);

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: true,
        });
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.message,
        });
    }
}

// Clear All Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}