function toggleFolder() {
    const folder = document.getElementById('Folder');
    const files = document.getElementById('files');
    const isOpen = files.style.display === 'block';

    folder.innerText = (isOpen ? '▸' : '▾') + folder.innerText.slice(1);
    files.style.display = isOpen ? 'none' : 'block';
}