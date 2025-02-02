const previewWrapper = document.getElementById('preview-wrapper');
const resizeCorner = document.getElementById('resize-hande');

let isResizing = false;
let startWidth, startHeight, startX, startY;

resizeCorner.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevent text selection

    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = previewWrapper.offsetWidth;
    startHeight = previewWrapper.offsetHeight;

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
});

function resize(e) {
    if (!isResizing) return;

    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);

    // Apply the new dimensions with constraints
    if (newWidth >= 100 && newWidth <= window.innerWidth) {
        previewWrapper.style.width = `${newWidth}px`;
    }
    if (newHeight >= 100 && newHeight <= window.innerHeight) {
        previewWrapper.style.height = `${newHeight}px`;
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}