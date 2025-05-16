if (!document.getElementById('drawscrib-canvas')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'drawscrib-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = 9999;
    canvas.style.pointerEvents = 'none'; // Let mouse through unless you're drawing
    canvas.style.backgroundColor = 'black';
    document.body.appendChild(canvas);

    // TODO: Hook your drawing logic here (mousedown, mousemove, etc.)
}

