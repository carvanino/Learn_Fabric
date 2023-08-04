// const canvas = new fabric.Canvas('canvas', {
//     width: 900,
//     height: 600,
//     // backgroundColor: 'red'
// });

// fabric.Image.fromURL('https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg', (img) => {
//     canvas.backgroundImage = img;
//     canvas.requestRenderAll();
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
        canvas.requestRenderAll();
    });
};

const setColorPicker = (event) => {
    // const colorPicker = document.getElementById('colorPicker');
    const colorPicker = event.target;
    const currentColor = colorPicker.getAttribute('data-current-color');
    // console.log(currentColor);
    color = currentColor;
    canvas.freeDrawingBrush.color = currentColor;
}

const createRect = (event, canvas) => {
    console.log('RECT');
    const canvCenter = canvas.getCenter();
    console.log(canvCenter)
    const rect = new fabric.Rect({
        width: 50,
        height: 50,
        top: 0,
        left: canvCenter.left,
        fill: color,
        objectCaching: false
    });
    rect.animate('top', canvCenter.top, {
        onChange: canvas.requestRenderAll.bind(canvas)
    });
    rect.on('selected', () => {
        rect.fill = 'white';
        canvas.requestRenderAll();
    });
    rect.on('deselected', () => {
        rect.fill = color;
        canvas.requestRenderAll();
    });
    canvas.add(rect);
    canvas.requestRenderAll();
}

const createCircle = (event, canvas) => {
    const canvCenter = canvas.getCenter();
    const circle = new fabric.Circle({
        radius: 20,
        fill: color,
        left: canvCenter.left,
        top: 0,
        objectCaching: false
    });
    circle.animate('top', canvas.height, {
        onChange: canvas.requestRenderAll.bind(canvas),
        onComplete: () => {
            circle.animate('top', canvCenter.top, {
                onChange: canvas.requestRenderAll.bind(canvas),
                easing: fabric.util.ease.easeOutBounce,
                durartion: 200
            });
        }
    });
    circle.on('selected', () => {
        circle.fill = 'white';
        // use set instead to still get the benefit of caching
        // circle.set('fill', 'white')
        canvas.requestRenderAll();
    });
    circle.on('deselected', () => {
        circle.fill = color;
        canvas.requestRenderAll();
    })
    canvas.add(circle);
    canvas.requestRenderAll();
}

const groupObjects = (canvas, group, shouldGroup) => {
    if (shouldGroup) {
        const objects = canvas.getObjects()
        console.log(objects);
        group.val = new fabric.Group(objects);
        clearCanvas(canvas);
        canvas.add(group.val);
        console.log(group);
    } else {
        group.val.destroy()
        const grouped = group.val.getObjects();
        canvas.remove(group.val);
        grouped.forEach((obj) => {
            canvas.add(obj);
            canvas.requestRenderAll();
        })
        console.log(grouped);

    }
}

const canvas = initCanvas('canvas');
let mousePressed = false;
const imageURL = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg'

let color = '#000000';
const group = {};
const svgState = {};
let currentMode;
const modes = {
    pan: 'pan',
    draw: 'draw'
}
setBackground(imageURL, canvas);


const toggleModes = (event, mode) => {
    const b = document.querySelectorAll(".modes");
    currentMode = mode;

    let clickedButton = event.target;
    if (clickedButton.style.backgroundColor) {
        // If the clicked button already has a background color, remove it
        // and turn off currentMode
        console.log('Removed');
        clickedButton.style.backgroundColor = "";
        currentMode = ''
    } else {
        b.forEach(button => {
            // Make sure all the buttons are colorless
            button.style.backgroundColor = "";
        });
        // add color to only the clicked button
        clickedButton.style.backgroundColor = "cyan";
    }

    // Additional configuration or actions based on the mode
    switch (currentMode) {
        case modes.pan:
            // Perform pan-specific configuration or actions
            setPanEvent(canvas);
            console.log('PAN mode configuration');
            break;
        case modes.draw:
            // Perform draw-specific configuration or actions
            canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
            // canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
            // console.log('Canvas color = ', color);
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = 20;
            canvas.isDrawingMode = true;
            canvas.requestRenderAll();
            console.log('DRAW mode configuration');
            break;
        default:
            console.log('This is cM', currentMode)
            // Default configuration or actions for other modes
            canvas.isDrawingMode = false;
            break;
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
            canvas.requestRenderAll();
        }
    });

}

const clearCanvas = (canvas) => {
    svgState.val = canvas.toSVG()
    console.log(svgState)
    canvas.getObjects().forEach((obj) => {
        if (obj !== canvas.backgroundImage) {
            canvas.remove(obj)
        }
    })
}

const restoreCanvas = (canvas, svgState, bgURL) => {
    if (svgState.val) {
        // clearCanvas(canvas);
        console.log(imageURL)
        fabric.loadSVGFromString(svgState.val, (objects) => {
            console.log(objects);
            objects = objects.filter(o => o['xlink:href'] !== bgURL)
            // objects = objects.filter((ob) => {
            //     // console.log(ob)
            //     if (ob.canvas.freeDrawingBrush.points) {
            //         group.val = new fabric.Group(ob);
            //         // canvas.add(group.val);
            //         return group.val;
            //     }
            // })
            canvas.add(...objects);
            canvas.requestRenderAll();
        })
    }
}
const reader = new FileReader();
const addImage = (e) => {
    const inputElem = document.getElementById('imageUp');
    const file = inputElem.files[0];
    // console.log(file);
    reader.readAsDataURL(file);
}

const uploadedImage = document.getElementById('imageUp');
uploadedImage.addEventListener('change', addImage);
reader.addEventListener('load',  () => {
    fabric.Image.fromURL(reader.result, img => {
        canvas.add(img);
        // console.log(img);
        canvas.requestRenderAll();
    });
});
canvas.requestRenderAll();