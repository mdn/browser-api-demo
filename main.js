var browser = document.querySelector('iframe');

var back = document.querySelector('.back');
var fwd = document.querySelector('.forward');
var urlBar = document.querySelector('input');
var urlForm = document.querySelector('form');
var stopReload = document.querySelector('.stop-reload');
var zoomIn = document.querySelector('.zoom-in');
var zoomOut = document.querySelector('.zoom-out');

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