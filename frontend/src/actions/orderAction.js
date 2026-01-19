import {
    ALL_ORDERS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    MY_ORDERS_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    NEW_ORDER_FAIL,
    NEW_ORDER_REQUEST,
    NEW_ORDER_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    PAYMENT_STATUS_FAIL,
    PAYMENT_STATUS_REQUEST,
    PAYMENT_STATUS_SUCCESS,
    UPDATE_ORDER_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS
} from "../constants/orderConstants";

// Helper to get orders from localStorage
const getOrdersFromStorage = () => {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
};

// Helper to save orders to localStorage
const saveOrdersToStorage = (orders) => {
    localStorage.setItem('orders', JSON.stringify(orders));
};

// New Order
export const newOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ORDER_REQUEST });

        // Create order with ID and timestamp
        const newOrder = {
            ...order,
            _id: 'order-' + Date.now(),
            createdAt: new Date().toISOString(),
            orderStatus: 'Processing',
            paymentInfo: {
                id: 'payment-' + Date.now(),
                status: 'succeeded'
            }
        };

        // Save to localStorage
        const orders = getOrdersFromStorage();
        orders.push(newOrder);
        saveOrdersToStorage(orders);

        dispatch({
            type: NEW_ORDER_SUCCESS,
            payload: { order: newOrder },
        });

    } catch (error) {
        dispatch({
            type: NEW_ORDER_FAIL,
            payload: error.message,
        });
    }
};

// Get User Orders
export const myOrders = () => async (dispatch) => {
    try {
        dispatch({ type: MY_ORDERS_REQUEST });

        const orders = getOrdersFromStorage();

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: orders,
        });

    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.message,
        });
    }
};

// Get Order Details
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST });

        const orders = getOrdersFromStorage();
        const order = orders.find(o => o._id === id);

        if (!order) {
            throw new Error('Order not found');
        }

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: order,
        });

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.message,
        });
    }
};

// Get Payment Status
export const getPaymentStatus = (id) => async (dispatch) => {
    try {
        dispatch({ type: PAYMENT_STATUS_REQUEST });

        // Mock payment status
        const txn = {
            id: id,
            status: 'SUCCESS',
            amount: 0
        };

        dispatch({
            type: PAYMENT_STATUS_SUCCESS,
            payload: txn,
        });

    } catch (error) {
        dispatch({
            type: PAYMENT_STATUS_FAIL,
            payload: error.message,
        });
    }
};

// Get All Orders ---ADMIN
export const getAllOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST });

        const orders = getOrdersFromStorage();

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: orders,
        });

    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.message,
        });
    }
};

// Update Order ---ADMIN
export const updateOrder = (id, orderUpdate) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ORDER_REQUEST });

        const orders = getOrdersFromStorage();
        const orderIndex = orders.findIndex(o => o._id === id);

        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        orders[orderIndex] = {
            ...orders[orderIndex],
            ...orderUpdate
        };

        saveOrdersToStorage(orders);

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: true,
        });

    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.message,
        });
    }
};

// Delete Order ---ADMIN
export const deleteOrder = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ORDER_REQUEST });

        const orders = getOrdersFromStorage();
        const filteredOrders = orders.filter(o => o._id !== id);
        saveOrdersToStorage(filteredOrders);

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: true,
        });

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.message,
        });
    }
};

// Clear All Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}