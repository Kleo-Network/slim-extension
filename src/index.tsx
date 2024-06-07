// import React from 'react';
// import { BrowserRouter } from 'react-router-dom'
// import App from './App';
// import './index.css'


// rootDiv.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from 'react'
import './App.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';

const root = document.createElement("div")
root.className = "container"
document.body.appendChild(root)
const rootDiv = ReactDOM.createRoot(root);
rootDiv.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)