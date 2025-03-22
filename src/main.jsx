import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store.jsx';
import App from './App.jsx';
import "./CSS/index.module.css"
import "./CSS/styles.module.css";
import "./index.css";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
          <App />
    </Provider>
  </StrictMode>
);