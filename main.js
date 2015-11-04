var browser = document.querySelector('iframe');

var back = document.querySelector('.back');
var fwd = document.querySelector('.forward');
var urlBar = document.querySelector('.urlForm input');
var urlForm = document.querySelector('.urlForm');
var stopReload = document.querySelector('.stop-reload');
var zoomIn = document.querySelector('.zoom-in');
var zoomOut = document.querySelector('.zoom-out');

var search = document.querySelector('.search');
var prev = document.querySelector('.prev');
var next = document.querySelector('.next');
var searchBar = document.querySelector('.searchForm input');
var searchForm = document.querySelector('.searchForm');
var searchToggle = document.querySelector('.searchToggle');

var zoomFactor = 1;

// controls-related event listeners

back.addEventListener('touchend',function() {
  browser.goBack();
});

fwd.addEventListener('touchend',function() {
  browser.goForward();
});

urlForm.addEventListener('submit',function(e) {
  e.preventDefault();
  browser.src = urlBar.value;
  urlBar.blur();
});

stopReload.addEventListener('touchend',function() {
  if(stopReload.textContent === 'x') {
    browser.stop();
  } else {
    browser.reload();
  }
});

zoomIn.addEventListener('touchend',function() {
  zoomFactor += 0.1;
  browser.zoom(zoomFactor);
});

zoomOut.addEventListener('touchend',function() {
  zoomFactor -= 0.1;
  browser.zoom(zoomFactor);
});

// search-related event listeners

var searchActive = false;
prev.disabled = true;
next.disabled = true;

searchToggle.addEventListener('touchend',function() {
  if(search.getAttribute('class') === 'search') {
    search.setAttribute('class', 'search shifted');
  } else if(search.getAttribute('class') === 'search shifted') {
    search.setAttribute('class', 'search');
    if(searchActive) {
      browser.clearMatch();
      searchActive = false;
      prev.disabled = true;
      next.disabled = true;
      searchBar.value = '';
    } 
  }
});

searchForm.addEventListener('submit',function(e) {
  e.preventDefault();
  browser.findAll(searchBar.value, "case-sensitive");
  searchActive = true;
  prev.disabled = false;
  next.disabled = false;
  searchBar.blur();
});

prev.addEventListener('touchend',function() {
  browser.findNext("backward");
});

next.addEventListener('touchend',function() {
  browser.findNext("forward");
});

//browser.addEventListener('mozbrowserfindchange', function(e) {
 // can react to find changes if required
//})

// browser-related event listeners

browser.addEventListener('mozbrowserloadstart',function() {
  stopReload.textContent = 'x'; 
});

browser.addEventListener('mozbrowserloadend',function() {
  canMoveBwd();
  canMoveFwd();
  stopReload.textContent = 'R'; 
});

browser.addEventListener('mozbrowserlocationchange', function (e) {
  urlBar.value = e.detail;
});

browser.addEventListener('mozbrowsererror', function (e) {
  console.log("Loading error: " + e.detail);
});

// function definitions

function canMoveBwd() {
  var request = browser.getCanGoBack();

  request.onsuccess = function() {
    if (request.result) {
      back.disabled = false;
      console.log("It's possible to navigate the history backward.");
    } else {
      back.disabled = true;
      console.log("It's not possible to navigate the history backward.");
    }
  }
}

function canMoveFwd() {
  var request = browser.getCanGoForward();

  request.onsuccess = function() {
    if (request.result) {
      fwd.disabled = false;
      console.log("It's possible to navigate the history forward.");
    } else {
      fwd.disabled = true;
      console.log("It's not possible to navigate the history forward.");
    }
  }
}