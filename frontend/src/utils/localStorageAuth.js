// localStorage utility for authentication with auto-expiry

const USER_KEY = 'flipkart_user';
const EXPIRY_DAYS = 5;

// Save user with expiry timestamp
export const saveUser = (user) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);

    const userData = {
        ...user,
        expiryTimestamp: expiryDate.getTime()
    };

    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return userData;
};

// Get user if not expired
export const getUser = () => {
    const userData = localStorage.getItem(USER_KEY);

    if (!userData) {
        return null;
    }

    try {
        const user = JSON.parse(userData);
        const now = new Date().getTime();

        // Check if expired
        if (user.expiryTimestamp && now > user.expiryTimestamp) {
            removeUser();
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

// Remove user (logout)
export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const user = getUser();
    return user !== null;
};

// Check and clean expired data (call on app init)
export const checkExpiry = () => {
    const user = getUser();
    if (!user) {
        removeUser();
    }
};

// Mock login function
export const mockLogin = (email, password) => {
    // Simple mock validation
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    // Create mock user
    const user = {
        _id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        role: email === 'admin@flipkart.com' ? 'admin' : 'user',
        avatar: {
            url: 'https://via.placeholder.com/150'
        },
        createdAt: new Date().toISOString()
    };

    return saveUser(user);
};

// Mock register function
export const mockRegister = (name, email, password) => {
    if (!name || !email || !password) {
        throw new Error('All fields are required');
    }

    // Create mock user
    const user = {
        _id: Date.now().toString(),
        name: name,
        email: email,
        role: 'user',
        avatar: {
            url: 'https://via.placeholder.com/150'
        },
        createdAt: new Date().toISOString()
    };

    return saveUser(user);
};

// Update user profile
export const updateUserProfile = (updates) => {
    const user = getUser();
    if (!user) {
        throw new Error('No user logged in');
    }

    const updatedUser = {
        ...user,
        ...updates,
        expiryTimestamp: user.expiryTimestamp // Preserve expiry
    };

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
};
