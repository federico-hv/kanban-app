/*
	This file runs the starting function
 */
import './main.css';
import 'array.prototype.findindex';		// npm module. Es6 feature. Finds the index of the first element that is equal to the condition
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';  
import alt from './libs/alt';		    // -> Alt singleton
import storage from './libs/storage';   // -> Custom localStorage object
import persist from './libs/persist';   // -> Final Store implementation

main();

function main(){
  
  persist(alt, storage, 'app'); // sends singleton, custom localStorage obj and a name to persist app's state
  const app = document.createElement('div'); 

  document.body.appendChild(app);

  ReactDOM.render(<App/>, app); // Renders to a div(react's sandbox) before rendering to the DOM's body
}
