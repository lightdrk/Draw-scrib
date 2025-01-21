const page = document.getElementByTagName('body');

function canvas_element(){
	const canvas = document.createElement('canvas');
	canvas.id = 'canvasid';
	canvas.style.backgroundColor = 'rgba(0,0,0,0.4)';
	canvas.style.position = 'absolute';
	canvas.style.zIndex = '1';
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	return canvas
}

function slider(){
	const slider_container = document.createElement('div');
	const input_slider = document.createElement('input');
	input_slider.type = 'range';
	input_slider.id = "slider";
	input_slider.min = '1';
	input_slider.max = '10';
	input_slider.value = '0';
}


