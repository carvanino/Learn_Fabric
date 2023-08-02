// const canvas = new fabric.Canvas('canvas', {
//     width: 900,
//     height: 600,
//     // backgroundColor: 'red'
// });

// fabric.Image.fromURL('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg', (img) => {
//     canvas.backgroundImage = img;
//     canvas.renderAll();
// })

const initCanvas = (id) => {
    return new fabric.Canvas(id, {
        width: 900,
        height: 600,
        selection: false, // prevents default windows selection wheen the canva is clicked upon
    });
};


const setBackground = (url, canvas) => {
    fabric.Image.fromURL(url, (img) => {
        canvas.backgroundImage = img;
        canvas.renderAll();
    });
};


const canvas = initCanvas('canvas');
let mousePressed = false;
const imgaeURL = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'

let currentMode;
const modes = {
    pan: 'pan',
    draw: 'draw'
}
setBackground(imgaeURL, canvas);

const toggleModes = (event, mode) => {
    const b = document.querySelectorAll(".modes");
    let clickedButtonId = event.target.id;
    let clickedButton = document.getElementById(clickedButtonId);
    console.log(b);
    canvas.isDrawingMode = false;
    canvas.renderAll();
    currentMode = mode;

    if (clickedButton.style.backgroundColor) {
        // If the clicked button already has a background color, remove it
        clickedButton.style.backgroundColor = "";
        currentMode = ''
        
    } else {
        b.forEach(button => {
            button.style.backgroundColor = ""; // Reset background color for all buttons
        });
        // Otherwise, set the background color for the clicked button
        clickedButton.style.backgroundColor = "cyan";
    }
};

const setPanEvent = (canvas) => {
    canvas.on('mouse:move', (event) => {
        // console.log(event);
        if (mousePressed && currentMode == modes.pan) {
            canvas.setCursor('grab');
            const mEvent = event.e;
            // console.log(mEvent.movementX, mEvent.movementY);
            const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
            canvas.relativePan(delta);
        }
        if (mousePressed && currentMode === modes.draw) {
            canvas.isDrawingMode = true;
            canvas.renderAll();
        }
    });
    
    canvas.on('mouse:up', (event) => {
        mousePressed = false;
        canvas.setCursor('default');
    });
    
    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        if (currentMode === modes.pan) {
            canvas.setCursor('grab');
            canvas.renderAll();
        }
    });

}
setPanEvent(canvas);

canvas.renderAll();