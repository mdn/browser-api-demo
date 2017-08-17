var browser = document.querySelector('iframe');
var controls = document.querySelector('.controls');

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

function onBackPress() {
  browser.goBack();
};
back.addEventListener('touchend', onBackPress);
back.addEventListener('click', onBackPress);

function onFwdPress() {
  browser.goForward();
};
fwd.addEventListener('touchend', onFwdPress);
fwd.addEventListener('click', onFwdPress);

urlForm.addEventListener('submit',function(e) {
  e.preventDefault();
  browser.src = urlBar.value;
  urlBar.blur();
});

function onStopReloadPress() {
  if(stopReload.textContent === 'x') {
    browser.stop();
  } else {
    browser.reload();
  }
};
stopReload.addEventListener('touchend', onStopReloadPress);
stopReload.addEventListener('click', onStopReloadPress);

function onZoomInPress() {
  zoomFactor += 0.1;
  browser.zoom(zoomFactor);
};
zoomIn.addEventListener('touchend', onZoomInPress);
zoomIn.addEventListener('click', onZoomInPress);

function onZoomOutPress() {
  zoomFactor -= 0.1;
  browser.zoom(zoomFactor);
};
zoomOut.addEventListener('touchend', onZoomOutPress);
zoomOut.addEventListener('click', onZoomOutPress);

// search-related event listeners

var searchActive = false;
prev.disabled = true;
next.disabled = true;

function onSearchTogglePress() {
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
};
searchToggle.addEventListener('touchend', onSearchTogglePress);
searchToggle.addEventListener('click', onSearchTogglePress);

searchForm.addEventListener('submit',function(e) {
  e.preventDefault();
  browser.findAll(searchBar.value, 'case-sensitive');
  searchActive = true;
  prev.disabled = false;
  next.disabled = false;
  searchBar.blur();
});

function onFindBackwardPress() {
  browser.findNext('backward');
};
prev.addEventListener('touchend', onFindBackwardPress);
prev.addEventListener('click', onFindBackwardPress);

function onFindForwardPress() {
  browser.findNext('forward');
};
next.addEventListener('touchend', onFindForwardPress);
next.addEventListener('click', onFindForwardPress);

//browser.addEventListener('mozbrowserfindchange', function(e) {
 // can react to find changes if required
//})

// browser-related event listeners

browser.addEventListener('mozbrowserloadstart',function() {
  stopReload.textContent = 'x'; 
});

browser.addEventListener('mozbrowserloadend',function(e) {
  canMoveBwd();
  canMoveFwd();
  stopReload.textContent = 'R';
  console.log(e.detail.backgroundColor);
  controls.style.background = e.detail.backgroundColor;
});

browser.addEventListener('mozbrowserlocationchange', function (e) {
  urlBar.value = e.detail.url;
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
