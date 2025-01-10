const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const form = document.querySelector('.form-container'); // Select the form container

// Set canvas dimensions
canvas.width = window.innerWidth * 0.8; // 80% of window width
canvas.height = 400; // Fixed height

// Get canvas center
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Draw initial lines
drawCross();

// Add event listener for the form
form.addEventListener('input', () => {
    // Get input values
    const alpha = parseFloat(document.getElementById('alpha-input').value); // Alpha angle
    const n1 = parseFloat(document.getElementById('n1-input').value); // Refractive index n1
    const n2 = parseFloat(document.getElementById('n2-input').value); // Refractive index n2
    const betaSpan = document.getElementById('beta'); // Beta display span

    if (!isNaN(alpha) && !isNaN(n1) && !isNaN(n2)) {
        drawLineAtAngle(alpha, n1, n2);

        // Calculate β (refracted angle)
        const beta = calculateRefraction(alpha, n1, n2);
        if (beta !== null) {
            betaSpan.textContent = `Refracted Angle (β): ${beta.toFixed(2)}°`;
        } else {
            betaSpan.textContent = `Total Internal Reflection`;
        }
    }
});


// Function to draw the cross (horizontal and vertical lines)
function drawCross() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw vertical line (y-axis)
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Draw horizontal line (x-axis)
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
}

// Function to draw a line based on the angle relative to the vertical axis (y-axis)
function drawLineAtAngle(angle, n1, n2) {
    drawCross(); // Redraw the cross to clear previous lines

    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;

    // Set line length
    const lineLength = 100;

    // Calculate line end coordinates
    const endX = centerX + lineLength * Math.sin(radians);
    const endY = centerY - lineLength * Math.cos(radians); // Subtract because canvas Y increases downward

    // Draw the line from the center
    ctx.strokeStyle = 'red'; // Line color
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); // Start at canvas center
    ctx.lineTo(endX, endY); // Draw to calculated end point
    ctx.stroke();

    // Draw the opposite line (symmetrical to the first line)
    const endX2 = centerX - lineLength * Math.sin(radians);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); // Start at canvas center
    ctx.lineTo(endX2, endY); // Draw to the opposite end point
    ctx.stroke();

    // Calculate refraction or total internal reflection
    const breakAngle = calculateBreakAngle(n1, n2);
    const refractedAngle = calculateRefraction(angle, n1, n2);

    if (refractedAngle !== null) {
        const refractedRadians = (refractedAngle * Math.PI) / 180;
        const refractedEndX = centerX + lineLength * Math.sin(refractedRadians);
        const refractedEndY = centerY + lineLength * Math.cos(refractedRadians);

        ctx.strokeStyle = 'green'; // Refracted line color
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(refractedEndX, refractedEndY);
        ctx.stroke();
    } else if (angle >= breakAngle) {
        // Highlight the break angle
        ctx.fillStyle = 'orange';
        ctx.font = '16px Arial';
        ctx.fillText(`Break Angle: ${breakAngle.toFixed(2)}°`, centerX + 10, centerY - 10);
    }
}

function calculateRefraction(alpha, n1, n2) {
    // Using Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
    const theta1 = (alpha * Math.PI) / 180; // Convert alpha to radians
    const sinTheta2 = (n1 / n2) * Math.sin(theta1); // Calculate sin(theta2)

    if (Math.abs(sinTheta2) <= 1) {
        return Math.asin(sinTheta2) * (180 / Math.PI); // Convert back to degrees
    } else {
        return null; // Total internal reflection
    }
}

function calculateBreakAngle(n1, n2) {
    // Critical angle formula: sin(theta_c) = n2 / n1
    if (n1 > n2) {
        return Math.asin(n2 / n1) * (180 / Math.PI); // Convert back to degrees
    } else {
        return 90; // No total internal reflection
    }
}