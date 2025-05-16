//import { ToolBarNew } from './utils.js';
import('./utils.js');
//import { canvas_element, slider, render } from './helper.js';
import('./helper.js');
const page = document.body;
const div = document.createElement('div');

const HISTORY_STACK = [];
const REDO_STACK = [];


let canvas = canvas_element();
let slid = slider()


div.appendChild(canvas);

div.appendChild(slid);
page.appendChild(div)
let slider_for_event = document.getElementById('slider');
if (slider_for_event){
	console.log(slider_for_event);
	slider_for_event.addEventListener('change', (e) => {
		console.log(e)
		let opacity = e.target.value;
		console.log(opacity);
		canvas.style.opacity = ''+opacity;
	})
}



document.addEventListener('keydown', (event)=>{
	let canvas = document.getElementById('canvasid');
	let debug_state = document.getElementById('position-debug') ? true : false; 
	if ((event.ctrlKey || event.metaKey) && event.key === 'z'){
		if (HISTORY_STACK.length){
			REDO_STACK.push(HISTORY_STACK.pop());
		}
		render(canvas);
	}

	if ((event.ctrlKey || event.metaKey) && event.key === 'u'){
		console.log(REDO_STACK);
		if (REDO_STACK.length){
			HISTORY_STACK.push(REDO_STACK.pop());
		}
		render(canvas);
	}

	if (event.ctrlKey && event.altKey && event.metaKey && !debug_state){
		console.log('event triggered')
		alert('debug position started');
		canvas.style.cursor = "crosshair";
		let debug_position = document.createElement('div');
		debug_position.id = "position-debug";
		debug_position.innerText = `x: ${event.clientX}, y: ${event.clientY}`
		debug_position.style.position = "absolute";
		debug_position.style.background = "rgba(255,255,255,1)"
		debug_position.style.padding = "5px";
		debug_position.style.pointerEvents = "none";
		debug_position.style.transition = "transform 0.1s ease-out"
		debug_position.style.zIndex = "10";
		canvas.appendChild(debug_position);

	}
});

// mouse event

let debug_position = document.getElementById('position-debug');
document.addEventListener('mousemove', (event)=>{
	debug_position = document.getElementById('position-debug');
	if (debug_position){
		debug_position.style.left = `${event.clientX+10}px`;
		debug_position.style.top = `${event.clientY+10}px`;
		debug_position.innerText = `x: ${event.clientX}, y: ${event.clientY}`;
	}


});


let tool_box = new ToolBarNew();
tool_box.penTool();
tool_box.squareTool();
//tool_box.hexagonTool();
tool_box.triangleTool();
tool_box.circleTool();
tool_box.colorBox();
tool_box.moveTool();
tool_box.saveTool();
tool_box.openFileTool();
tool_box.eraserTool();
tool_box.lineTool();
//tool_box.arrowsTool();
//tool_box.arrowsVTool();
tool_box.textTool();
tool_box.selectionTool();
tool_box.strokeBox();
div.appendChild(tool_box.outerBox());
tool_box.outerBoxMove();

