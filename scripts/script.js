// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;
let entryList;
// Make sure you register your service worker here too
document.addEventListener('DOMContentLoaded', () => {
  history.replaceState({page: 1},'','#home');
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        entryList = entries;
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);

        newPost.addEventListener('click', () => {
          if (document.querySelector('entry-page') != null) {
            document.querySelector('entry-page').remove();
            let entryPage = document.createElement('entry-page');
            body.appendChild(entryPage);
          }
          body.className = 'single-entry';
          let entryNum = entries.indexOf(entry) + 1;
          document.querySelector('entry-page').entry = newPost.entry;
          document.querySelector('header h1').innerHTML = 'Entry ' + entryNum;
          setState('entry', entry, entryNum);
        });
      });
    });
});

const settingsImg = document.querySelector('[alt = settings');
const title = document.querySelector('header h1');
const body = document.querySelector('body');

settingsImg.addEventListener('click', () => {
  if (history.state.page !== null && history.state.page === 2)
  {
    return;
  }
  body.className = 'settings';
  title.innerHTML = 'Settings'; 
  setState('settings');
});

title.addEventListener('click', () => {
  if (history.state.page !== null && history.state.page === 1)
  {
    return;
  }
  setState('home');
  body.removeAttribute('class');
  title.innerHTML = 'Journal Entries';
});

let currentPage = history.state;

window.addEventListener('popstate', () => {
  if (history.state.page !== null && history.state.page === 1) {
    body.removeAttribute('class');
    title.innerHTML = 'Journal Entries';
  } else if (history.state.page !== null && history.state.page === 2) {
    body.className = 'settings';
    title.innerHTML = 'Settings';
  } else {
    body.className = 'single-entry';
    let entryNum = entryList.indexOf(currentPage) + 1;
    if (document.querySelector('entry-page').entry !== null) {
      document.querySelector('entry-page').entry = currentPage.entry;
    }
    document.querySelector('header h1').innerHTML = 'Entry ' + entryNum;
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

