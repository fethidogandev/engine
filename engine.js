const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 40;

let startTime = null;
const cyclesPerMinute = 60;
const duration = 60 * 1000 / cyclesPerMinute; // Duration for each cycle in milliseconds

// Create an audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load and decode the audio file
const audioFile = './engine.mp3';
let audioBuffer = null;

fetch(audioFile)
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))
    .then(buffer => {
        audioBuffer = buffer;
    })
    .catch(error => console.error('Error loading audio:', error));

function playSound() {
    // Create a buffer source node
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Connect the source to the audio context's destination (i.e., speakers)
    source.connect(audioContext.destination);

    // Start playing the sound
    source.start(0);
}

function drawCircle(currentTime) {
    if (!startTime) {
        startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = elapsed / duration;

    if (progress < 1) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "gray"; // Set the fill color
        ctx.fill();
        ctx.closePath();

        // Calculate the angle based on progress
        const angleInDegrees = 360 * progress;
        const angleInRadians = angleInDegrees * (Math.PI / 180);

        // Calculate coordinates for the current angle
        const calculatedX = Math.cos(angleInRadians) * radius;
        const calculatedY = Math.sin(angleInRadians) * radius;

        ctx.strokeStyle = 'black'; // Line color
        ctx.lineWidth = 25; // Line width

        ctx.beginPath();
        ctx.moveTo(centerX, (centerY - 250) - calculatedY); // Move to the starting point
        ctx.lineTo(centerX + calculatedX, centerY - calculatedY);     // Draw a line to the ending point
        ctx.stroke();               // Stroke the path to actually draw the line
        ctx.closePath();            // Close the path

        // ctx.fillStyle = "#FF0000"; // Fill color (red in this case)
        // ctx.fillRect(centerX - 80, (centerY - 250) - calculatedY, 160, -120); // (x, y, width, height)

        var image = new Image();
        image.src = "./head.png"; // Replace with the path to your image
        ctx.drawImage(image, centerX - 80, (centerY - 410) - calculatedY, 160, 200); // (image, x, y, width, height)


        // Draw the point
        ctx.beginPath();
        ctx.arc(centerX + calculatedX, centerY - calculatedY, 35, 0, 2 * Math.PI, false);
        ctx.fillStyle = "black"; // Set the fill color
        ctx.fill();
        ctx.closePath();

    } else {
        // Reset the start time for the next cycle
        startTime = currentTime;
        if (audioBuffer) {
            playSound();
        }
    }

    // Request the next animation frame
    requestAnimationFrame(drawCircle);
}

// Kick off the animation loop
requestAnimationFrame(drawCircle);
