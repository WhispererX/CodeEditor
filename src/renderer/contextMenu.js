const contextMenu = document.getElementById('contextMenu');
const javascriptMenu = document.getElementById('javascriptMenu');
const htmlMenu = document.getElementById('htmlMenu');

// Show Context Menu
function showContextMenu(event) {
    event.preventDefault();
    contextMenu.style.display = 'block';

    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
}

// Hide Context Menu
function hideContextMenu() {
    contextMenu.style.display = 'none';
    javascriptMenu.style.display = 'none';
    htmlMenu.style.display = 'none';
}

// Togle context menu
window.addEventListener('contextmenu', showContextMenu);
window.addEventListener('click', hideContextMenu);

// Show JavaScript sub-menu on hover
const toggleJavascriptButton = document.getElementById('toggleJavascript');
toggleJavascriptButton.onmouseover = () => {

  htmlMenu.style.display = 'none';
    
  javascriptMenu.style.display = 'block';
  javascriptMenu.style.left = `${toggleJavascriptButton.getBoundingClientRect().right}px`;
  javascriptMenu.style.top = `${toggleJavascriptButton.getBoundingClientRect().top}px`;
};

// Hide JavaScript sub-menu when mouse leaves
javascriptMenu.onmouseleave = () => {
  javascriptMenu.style.display = 'none';
};

// Show HTML sub-menu on hover
const toggleHtmlButton = document.getElementById('toggleHtml');
toggleHtmlButton.onmouseover = () => {

  javascriptMenu.style.display = 'none';

  htmlMenu.style.display = 'block';
  htmlMenu.style.left = `${toggleHtmlButton.getBoundingClientRect().right}px`;
  htmlMenu.style.top = `${toggleHtmlButton.getBoundingClientRect().top}px`;
};

// Hide HTML sub-menu when mouse leaves
htmlMenu.onmouseleave = () => {
  htmlMenu.style.display = 'none';
};

// Hide sub-menus if mouse leaves the context menu
contextMenu.onmouseleave = () => {
  javascriptMenu.style.display = 'none';
  htmlMenu.style.display = 'none';
};

