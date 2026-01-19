import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../constants/wishlistConstants";
import { getProductById } from '../utils/indexedDB';

// Add to Wishlist
export const addToWishlist = (id) => async (dispatch, getState) => {
    // Get product from IndexedDB instead of API
    const product = await getProductById(id);

    if (!product) {
        console.error('Product not found');
        return;
    }

    dispatch({
        type: ADD_TO_WISHLIST,
        payload: {
            product: product._id,
            name: product.name,
            price: product.price,
            cuttedPrice: product.cuttedPrice,
            image: product.images[0].url,
            ratings: product.ratings,
        },
    });

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems));
}

// Remove from Wishlist
export const removeFromWishlist = (id) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_WISHLIST,
        payload: id,
    });

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems));
}