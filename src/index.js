import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js' // Ensure this is updated as well
import reportWebVitals from './reportWebVitals.js' // Update with .js extension
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)

// Optional: for measuring performance
reportWebVitals()
