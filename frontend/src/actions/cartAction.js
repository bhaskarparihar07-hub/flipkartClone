import { ADD_TO_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO, EMPTY_CART } from "../constants/cartConstants";
import { getProductById } from '../utils/indexedDB';

// Add to Cart
export const addItemsToCart = (id, quantity = 1) => async (dispatch, getState) => {
    // Get product from IndexedDB instead of API
    const product = await getProductById(id);

    if (!product) {
        console.error('Product not found');
        return;
    }

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: product._id,
            name: product.name,
            price: product.price,
            cuttedPrice: product.cuttedPrice,
            image: product.images[0].url,
            stock: product.stock,
            quantity,
        },
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

// Remove from Cart
export const removeItemsFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_FROM_CART,
        payload: id,
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

// Empty Cart
export const emptyCart = () => (dispatch, getState) => {
    dispatch({ type: EMPTY_CART });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

// Save Shipping Info
export const saveShippingInfo = (data) => (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
}