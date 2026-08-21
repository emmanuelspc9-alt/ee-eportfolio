let highestZIndex = 10;
let activeDrag = null;
let offsetX = 0, offsetY = 0;

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.style.display = 'flex';
  bringToFront(win);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (win) win.style.display = 'none';
}

function bringToFront(win) {
  highestZIndex++;
  win.style.zIndex = highestZIndex;
}

function dragStart(e, id) {
  const win = document.getElementById(id);
  bringToFront(win);
  activeDrag = win;
  
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;

  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
  if (!activeDrag) return;
  activeDrag.style.left = `${e.clientX - offsetX}px`;
  activeDrag.style.top = `${e.clientY - offsetY}px`;
}

function dragEnd() {
  activeDrag = null;
  document.removeEventListener('mousemove', dragMove);
  document.removeEventListener('mouseup', dragEnd);
}

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('clock').textContent = timeStr;
}

setInterval(updateClock, 1000);
updateClock();