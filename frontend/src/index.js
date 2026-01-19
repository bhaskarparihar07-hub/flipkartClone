import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { SnackbarProvider } from 'notistack';
import { initDB, seedProducts } from './utils/indexedDB';
import { checkExpiry } from './utils/localStorageAuth';

// Initialize IndexedDB and seed products
initDB().then(() => {
  seedProducts().catch(err => console.error('Error seeding products:', err));
}).catch(err => console.error('Error initializing DB:', err));

// Check and clean expired auth data
checkExpiry();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={2}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Router>
          <App />
        </Router>
      </SnackbarProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);