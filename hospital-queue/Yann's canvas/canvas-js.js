const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');

// Set initial drawing state
let drawing = false;
ctx.lineWidth = 5; // Set the line width
ctx.lineCap = 'round'; // Make lines round for smoother drawing

let pencilColor = '#000000'; // Initially set to black
ctx.strokeStyle = pencilColor; // Set the initial stroke color

const colorPicker = document.getElementById('color');

colorPicker.addEventListener('input', (e) => {
    pencilColor = e.target.value; // Get the new color
    ctx.strokeStyle = pencilColor; // Update the stroke color
  });

// Start drawing when the mouse is pressed
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  ctx.beginPath(); // Start a new path
  ctx.moveTo(e.offsetX, e.offsetY); // Move to the starting point
});

// Draw while the mouse is moving
canvas.addEventListener('mousemove', (e) => {
  if (drawing) {
    ctx.lineTo(e.offsetX, e.offsetY); // Draw a line to the new position
    ctx.stroke(); // Render the line
  }
});

// Stop drawing when the mouse is released
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Optionally, allow drawing when the mouse leaves the canvas (in case of mouse-up outside the canvas)
canvas.addEventListener('mouseout', () => {
  drawing = false;
});

// Clear the canvas when the clear button is clicked
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the entire canvas
});

function grading(text){
    let result = Math.floor(Math.random() * 6) + 5;
    document.getElementById(text).innerHTML = result + '/10'
}