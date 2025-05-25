//const pq = require('./utils/priorityQue');
//
//
//
class PriorityQueue{
	//complete priority ques
	constructor() {
		this.root = [];
	}

	parent(idx){
		return (idx-1)>>1;
	}

	left(idx){
		return (idx<<1)+1;
	}

	right(idx){
		return (idx<<1)+2;
	}

	heapify_up(idx){
		while (idx>0 && this.root[idx].near < this.root[this.parent(idx)].near){
			let val = this.root[idx];
			this.root[idx] = this.root[this.parent(idx)];
			this.root[this.parent(idx)] = val;
			idx = this.parent(idx);
		}
	}

	heapify_down(idx){
		let left = this.left(idx);
		let right = this.right(idx);
		let smallest = idx
		let length = this.root.length;
		if (left < length && this.root[idx].near > this.root[left].near){
			smallest = left;
		}
		if (right < length && this.root[smallest].near > this.root[right].near){
			smallest = right
		}
		if (smallest != idx){
			let val = this.root[smallest];
			this.root[smallest] = this.root[idx]
			this.root[idx] = val
			this.heapify_down(smallest);
		}
	}

	push(val){
		this.root.push(val);
		this.heapify_up(this.root.length-1);
	}

	pop(){
		let val = this.root.pop();
		if (this.root.length > 0){
			let swap = this.root[0]
			this.root[0] = val
			val = swap;
			this.heapify_down(0);
		}
		return val;
	}

	peek(){
		return this.root[0];
	}
}


class HTML {
	button(svg, name){
		const pen_button = document.createElement('button');
		pen_button.style.cursor = 'pointer';
		pen_button.style.width = "100%";
		pen_button.style.background = "transparent";
		pen_button.style.border = "none";
		pen_button.style.margin = "5px 0";
		pen_button.style.borderRadius = "14px";
		pen_button.style.display = "flex";
		pen_button.style.alignItems = "center";
		pen_button.style.padding = "5px 7px";
		pen_button.style.gap = "14px";
		pen_button.style.transition = "all 0.3s ease";
		pen_button.style.whiteSpace = "nowrap";
		pen_button.style.color = "#fff"
		pen_button.title = name;
		pen_button.innerHTML+=svg

		const name_span = document.createElement('span');
		name_span.innerText = name;

		pen_button.addEventListener('mouseover', () => { 
			pen_button.style.background = 'rgba(255,255,255,0.1)';

			pen_button.appendChild(name_span);
		});
		pen_button.addEventListener('mouseout', () => { 
			pen_button.style.background = 'transparent';
			pen_button.removeChild(name_span)
		});

		return pen_button;
	}


}

const html = new HTML();

function distance(x1,y1, x2,y2){
	return (x2-x1)**2 + (y2-y1)**2;

}

const shape_creator = {
	"rectangle": (x1, y1, x2, y2, ctx)=>{
		ctx.beginPath();
		ctx.rect(x1, y1, x2 - x1, y2 - y1);
		ctx.stroke();
		ctx.closePath();
	},

	"circle": (lastX, lastY, x, y, ctx) =>{
		ctx.beginPath();
		let length = Math.sqrt(((x - lastX)**2 + (y - lastY)**2) / 2)
		ctx.arc(lastX, lastY, length, 0, 2*Math.PI );
		ctx.stroke();
		ctx.closePath();
	},

	"triangle": (lastX, lastY, x, y, ctx) =>{
		ctx.beginPath();
		let mid = lastX + (x-lastX)/2;
		ctx.moveTo(mid, lastY);
		ctx.lineTo(x, y);
		ctx.lineTo(lastX, y);
		ctx.lineTo(mid,lastY);
		ctx.stroke();
		ctx.closePath();
	},
	"pen": (trace, ctx) => {
		ctx.beginPath();
		ctx.moveTo(trace[0][0], trace[0][1]);
		for (let [x,y] of trace){
			ctx.lineTo(x, y);
			ctx.stroke();
		}
		ctx.closePath();
	},
	"text": (x, y, word, ctx) => {
		ctx.fillText(word, x, y);
	},
	"line": (x, y, x1, y1, ctx) =>{
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x1,y1);
		ctx.stroke();
		ctx.closePath();
	}
}




const page = document.body;
const div = document.createElement('div');

const HISTORY_STACK = [];
const REDO_STACK = [];

function canvas_element(){
	const canvas = document.createElement('canvas');
	canvas.id = 'canvasid';
	canvas.style.backgroundColor = 'rgba(0,0,0,1)';
	canvas.style.opacity = '0.5';
	canvas.style.position = 'absolute';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.zIndex = '9999';
	canvas.width = document.documentElement.scrollWidth;
	canvas.height = document.documentElement.scrollHeight;
	return canvas
}

function render(canvas){
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0,0, canvas.width, canvas.height);
	for (let shape_data of HISTORY_STACK){
		ctx.lineWidth = shape_data.lineWidth;
		console.log('rendering ....');
		console.log(shape_data);
		switch (shape_data.shape){
			case "pen":
				shape_creator["pen"](shape_data.trace, ctx);
				break;
			case "text":
				shape_creator["text"](shape_data.x, shape_data.y, shape_data.word, ctx);
				break
			case "line":
				shape_creator["line"](shape_data.x1, shape_data.y1, shape_data.x2, shape_data.y2, ctx);
				break
			default:
				shape_creator[shape_data.shape](shape_data.x1, shape_data.y1, shape_data.x2, shape_data.y2, ctx);
		}
	}
}

function movement(proximity, x, y){
	switch( proximity.shape){
		case "pen":
			proximity

		case "text":

		case "line":

		default:
			proximity.x2 = x + (proximity.x2 - proximity.x1);
			proximity.y2 = y + (proximity.y2 - proximity.y1);
			proximity.x1 = x;
			proximity.y1 = y;
	}

}


let canvas = canvas_element();


div.appendChild(canvas);

page.appendChild(div)

class ToolBarNew{
	constructor(){
		this.toolBox = document.createElement('div');
		this.corner = document.createElement('div');
		this.canvas = document.getElementById('canvasid');
		this.ctx = this.canvas.getContext('2d');
		this.globalheight = '25px';
		this.globalWidth = '25px';
		this.globalColor = 'rgba(255,255,255,1)';
	}

	outerBox(){
		this.toolBox.style.flexDirection = 'column';
		this.toolBox.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
		this.toolBox.style.border = '1px solid rgba(255,255,255,0.1)';
		this.toolBox.style.borderRadius = '16px';
		this.toolBox.style.backdropFilter = 'blur(12px) saturate(180%)';
		this.toolBox.style.boxShadow = '0 0 30px rgba(0,0,0,0.5)';
		this.toolBox.style.padding = '12px 6px';
		this.toolBox.style.alignItems = 'center';
		this.toolBox.style.overflow = 'hidden';
		this.toolBox.style.cursor = 'move';
		this.toolBox.id = 'tool-box';
		this.toolBox.style.position = 'absolute';
		this.toolBox.style.zIndex = '999999';
		this.toolBox.style.display = 'flex';
		//this.toolBox.style.justifyContent = 'space-between';
		this.toolBox.style.top = '0';
		this.toolBox.style.border = '1px solid';
		this.toolBox.style.left = "100px";
		this.toolBox.style.right = "100px";
		this.toolBox.style.width = '50px';
		//this.moverBox.appendChild(this.toolBox);
		let isDragging = false;
		let offsetX = '500';
		let offsetY = '500';
		this.toolBox.addEventListener('mouseover', (e)=>{
			this.toolBox.style.width = '150px';
		});
		this.toolBox.addEventListener('mouseout', ()=>{
			this.toolBox.style.width = '50px';
		});
		this.toolBox.addEventListener('mousedown', (e)=>{
			e.preventDefault();
			isDragging = true;
			offsetX = e.clientX - this.toolBox.offsetLeft;
			offsetY = e.clientY - this.toolBox.offsetTop;


		});
		document.addEventListener('mousemove', (e)=>{
			if (isDragging){
				let x = e.clientX - offsetX;
				let y = e.clientY - offsetY;

				this.toolBox.style.top = `${y}px`;
				this.toolBox.style.left = `${x}px`;
			}
		});
		document.addEventListener('mouseup', ()=>{
			isDragging = false;
			this.toolBox.style.width = '100px';
		});
		return this.toolBox;
	}

	canvasOpacityController(){
		const slider_container = document.createElement('div');
		const input_slider = document.createElement('input');
		slider_container.appendChild(input_slider);
		input_slider.type = 'range';
		input_slider.id = "slider";
		input_slider.min = '0.0';
		input_slider.max = '1.0';
		input_slider.step = '0.1';
		input_slider.value = '0.5';

		input_slider.style.zIndex = '2';
		slider_container.style.backgroundColor = '#fff';
		slider_container.style.position = 'absolute';
		slider_container.style.zIndex = '999999';
		slider_container.style.top = '0'
		return slider_container;
	}

	penTool(){
		//let lastX = 0;
		//let lastY = 0;
		let isDrawing = false;
		let isActive = false
		let trace = null;
		let mouseDown = (e)=>{
			isDrawing = true;
			this.ctx.beginPath();
			if (!trace){
				trace = [];
			}
			trace.push([e.offsetX, e.offsetY]);
			//[lastX, lastY] = [e.offsetX, e.offsetY];
		}

		let mouseMove = (e)=>{
			if (!isDrawing) return;
			this.ctx.strokeStyle = this.globalColor;
			//this.ctx.moveTo(lastX, lastY);
			this.ctx.lineTo(e.offsetX, e.offsetY);
			trace.push([e.offsetX, e.offsetY]);
			this.ctx.stroke();
			//[lastX, lastY] = [e.offsetX, e.offsetY]
		}

		let mouseUp = (e)=>{
			this.ctx.closePath();
			HISTORY_STACK.push({ "shape": "pen", trace, "lineWidth": this.ctx.lineWidth})
			trace = null;
			isDrawing = false;
		}

		this.canvas.style.cursor = 'crosshair';
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';

		let svg1 = `
			<svg xmlns="http://www.w3.org/2000/svg"
			     viewBox="0 0 24 24"
			     fill="none"
			     stroke="currentColor"
			     stroke-width="2"
			     stroke-linecap="round"
			     stroke-linejoin="round"
			     preserveAspectRatio="xMidYMid meet"
			     style="width: 24px; height: 24px;"
			     class="feather feather-pen-tool">
			  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
			  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
			  <path d="M2 2l7.586 7.586"></path>
			  <circle cx="11" cy="11" r="2"></circle>
			</svg>
		`

		let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="non
e" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" cla
ss="feather feather-pen-tool"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-
7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11
" r="2"></circle></svg>`;
		let name = 'Pen Tool';

		const pen_button = html.button(svg1, name)//document.createElement('button');
		pen_button.addEventListener('click',() => {	
			if (!isActive){
				isActive = true;
				this.canvas.addEventListener('mousedown', mouseDown);
				this.canvas.addEventListener('mousemove', mouseMove);
				this.canvas.addEventListener('mouseup', mouseUp);
			}else{
				this.canvas.style.cursor = 'auto';
				this.canvas.removeEventListener('mousedown', mouseDown);
				this.canvas.removeEventListener('mousemove', mouseMove);
				this.canvas.removeEventListener('mouseup', mouseUp);
				isActive = false;
			}
		});
		this.toolBox.appendChild(pen_button);
		return pen_button;
	}

	toolContainer(){
		const container = document.createElement('div');

		return container;
	}

	squareTool(){
		let svg =`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-square">
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`
		const square_button = html.button(svg,'Square Tool');
		this.toolBox.appendChild(square_button);
		let isActive = false;

		let lastX = 0;
		let lastY = 0;
		let isDrawing = false;

		const mouseDown = (e) =>{
			isDrawing = true;
			isActive = true;
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		const mouseMove = (e) =>{
			if (!isDrawing) return;
		};

		const mouseUp = (e) =>{

			this.ctx.strokeStyle = this.globalColor;
			shape_creator["rectangle"](lastX, lastY, e.offsetX , e.offsetY, this.ctx);
			HISTORY_STACK.push({ "shape": "rectangle", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": this.ctx.lineWidth});
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		square_button.addEventListener('click',()=>{

			canvas.style.cursor = 'crosshair';
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';

			if (!isActive){
				isActive = true;
				console.log('adding event listener');
				canvas.addEventListener('mousedown', mouseDown);
				canvas.addEventListener('mousemove', mouseMove);
				canvas.addEventListener('mouseup', mouseUp);

			}else{
				canvas.style.cursor = 'pointer';
				canvas.removeEventListener('mousedown', mouseDown);
				canvas.removeEventListener('mousemove', mouseMove);
				canvas.removeEventListener('mouseup', mouseUp);
			}

		})
		return square_button;
	}


	circleTool(){
		let svg =`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="non
e" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" cla
ss="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>`;
		const circle_button = html.button(svg, 'Circle Tool');
		let isDrawing = false;
		let isActive = false;
		let lastX = 0;
		let lastY = 0;
		this.canvas.style.cursor = 'crosshair';
		this.toolBox.appendChild(circle_button);
		const mouseDown = (e) => {
			isDrawing = true;
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};
		const mouseMove = (e) => {
			if (!isDrawing) return;
		};

		const mouseUp = (e) => {
			this.ctx.strokeStyle = this.globalColor;
			shape_creator["circle"](lastX, lastY, e.offsetX, e.offsetY, this.ctx);
			HISTORY_STACK.push({ "shape": "circle", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": this.ctx.lineWidth});
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};
		circle_button.addEventListener('click', ()=>{
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			if (!isActive){
				isActive = true;
				canvas.addEventListener('mousedown', mouseDown);
				canvas.addEventListener('mousemove', mouseMove);
				canvas.addEventListener('mouseup', mouseUp);
			}else {
				canvas.style.cursor = 'pointer';
				canvas.removeEventListener('mousedown', mouseDown);
				canvas.removeEventListener('mousemove', mouseMove);
				canvas.removeEventListener('mouseup', mouseUp);
			}
		})
		return circle_button;
	}

	hexagonTool(){
		let hexagon_container = document.createElement('div');
		const square_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-hexagon';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		square_button.appendChild(icon);
		hexagon_container.appendChild(square_button);
		this.toolBox.appendChild(hexagon_container);
		square_button.addEventListener('click', ()=>{
			this.this.ctx.lineJoin = 'round';
			this.this.ctx.lineCap = 'round';
			let isDrawing = false;
			let lastX = 0;
			let lastY = 0;
			this.canvas.addEventListener('mousedown', (e)=>{
				isDrawing = true;
				this.this.ctx.beginPath();
				[lastX, lastY] = [e.offsetX, e.offsetY];
			});

			this.canvas.addEventListener('mouseup', (e)=>{
				this.this.ctx.strokeStyle = this.globalColor;
				this.ctx.beginPath();
				for (let i = 0; i < 6; i++) {
				  const angle = Math.PI / 3 * i;
				  const x = centerX + size * Math.cos(angle);
				  const y = centerY + size * Math.sin(angle);
				  if (i === 0) {
					this.ctx.moveTo(x, y);
				  } else {
					this.ctx.lineTo(x, y);
				  }
				}
				this.ctx.closePath();
			});
		});
		return hexagon_container;
	}

	triangleTool(){
		let svg =`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-
linejoin="round" class="feather feather-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>`;
		const triangle_button = html.button(svg, 'Triangle Tool');
		this.toolBox.appendChild(triangle_button);
		let isActive = false;
		let lastX = 0;
		let lastY = 0;
		let isDrawing = false;

		const mouseDown = (e) =>{
			isDrawing = true;
			isActive = true;
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		const mouseMove = (e) =>{
			if (!isDrawing) return;
		};

		const mouseUp = (e) =>{
			this.ctx.strokeStyle = this.globalColor;
			shape_creator["triangle"](lastX,lastY, e.offsetX, e.offsetY, this.ctx);
			HISTORY_STACK.push({ "shape": "triangle", "lineWidth": this.ctx.lineWidth, x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY });
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		triangle_button.addEventListener('click',()=>{

			canvas.style.cursor = 'crosshair';
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';

			if (!isActive){
				isActive = true;
				console.log('adding event listener');
				canvas.addEventListener('mousedown', mouseDown);
				canvas.addEventListener('mousemove', mouseMove);
				canvas.addEventListener('mouseup', mouseUp);

			}else{
				canvas.style.cursor = 'pointer';
				canvas.removeEventListener('mousedown', mouseDown);
				canvas.removeEventListener('mousemove', mouseMove);
				canvas.removeEventListener('mouseup', mouseUp);
			}

		})
		return triangle_button;
	}

	colorBox(){
		let colorBoxDiv = document.createElement('div');
		const colorInput = document.createElement('input');
		colorInput.id = "color-picker"
		colorInput.setAttribute('type', 'color');
		colorBoxDiv.appendChild(colorInput);
		this.toolBox.appendChild(colorBoxDiv);
		colorInput.addEventListener('input', (e)=>{
			this.globalColor = e.target.value;
		});
		return colorBoxDiv;
	}

	strokeBox(){
		let strokeBoxDiv = document.createElement('div');
		const input_slider = document.createElement('input');
		input_slider.type = 'range';
		input_slider.id = "slider";
		input_slider.min = '1';
		input_slider.max = '10';
		input_slider.step = '1';
		input_slider.value = '1';
		strokeBoxDiv.style.display = 'flex';
		strokeBoxDiv.style.alignItems = 'center';
		strokeBoxDiv.style.justifyContent = 'space-between';
		let current = input_slider.value;
		input_slider.addEventListener('change', (e) => {
			this.ctx.lineWidth = e.target.value*current;

		});
		strokeBoxDiv.appendChild(input_slider);
		this.toolBox.appendChild(strokeBoxDiv);
		return strokeBoxDiv;
	}

	lineTool(){
		let svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
		  <!-- Point A -->
		  <circle cx="50" cy="50" r="5" fill="black" />
		  
		  <!-- Point B -->
		  <circle cx="150" cy="150" r="5" fill="black" />

		  <!-- Dotted Line -->
		  <line x1="2" y1="2" x2="20" y2="20" 
			stroke="black" stroke-width="2" 
			stroke-dasharray="2,5" />
		</svg>
		`
		const line_button = html.button(svg, 'Line Join');
		this.toolBox.appendChild(line_button);

		let lineToolActive = false;
	
		line_button.addEventListener('click',()=>{
			console.log(HISTORY_STACK);
			this.ctx.strokeStyle = this.globalColor;
			canvas.style.cursor = 'crosshair';
			let lastX = null;
			let lastY = null;

			let mouseDown = (e) => {
				if (lastX & lastY){

					HISTORY_STACK.push({ "shape": "line", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": this.ctx.lineWidth});
					shape_creator["line"](lastX, lastY, e.offsetX, e.offsetY, this.ctx);
					lastX = null;
					lastY = null;

					return
				}
				lastX = e.offsetX;
				lastY = e.offsetY;
			};

			if (! lineToolActive){
				this.canvas.addEventListener('mousedown', mouseDown);
				lineToolActive = true;
			}else{
				this.canvas.removeEventListener('mousedown', mouseDown);
				lineToolActive = false;
			}
		})
		return line_button;
	}


	arrowsTool(){
		let square_container = document.createElement('div');
		const arrows_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-arrows-h';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		arrows_button.appendChild(icon);
		square_container.appendChild(arrows_button);
		this.toolBox.appendChild(square_container);
		arrows_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'move';

			let proximity_arr = new PriorityQueue();//min heap priority que
			let proximity = null;
			let lastX = 0;
			let lastY = 0;
			let isDrawing = false;
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			let mouseDown = (e) => {
				//when this is clicked it will get the info of 
				//the drawing nearest to it 
				//TODO:- complete priority que 
				let x = e.offsetX;
				let y = e.offsetY;
				isDrawing = true;
				for (let drawing of HISTORY_STACK){
					let near = distance(x,y, drawing.x, drawing.y) 
					drawing['near'] = near
					proximity_arr.push(drawing);
				}
				let shape_params = proximity_arr.pop();
				proximity = shape_params;
				this.ctx.clearRect(shape_params.x - 1, shape_params.y - 1, shape_params.length + 1, shape_params.length + 1);
				this.ctx.beginPath();
				this.ctx.rect(x, y, shape_params.length, shape_params.length);
				this.ctx.stroke();
				this.ctx.closePath();
				[lastX, lastY] = [x, y];
			};
			let mouseMove = (e) => {
				if (!proximity) return;
				this.ctx.clearRect(lastX-1, lastY-1, proximity.length+1, proximity.length+1);
				this.ctx.beginPath();
				this.ctx.rect(e.offsetX, e.offsetY, proximity.length, proximity.length);
				this.ctx.stroke();
				this.ctx.closePath();
				[lastX, lastY] = [e.offsetX, e.offsetY];
			};
			canvas.addEventListener('mousedown', mouseDown);

			canvas.addEventListener('mousemove', mouseMove);

			canvas.addEventListener('mouseup',(e)=>{
				canvas.removeEventListener('mousemove', mouseMove);
				[lastX, lastY] = [e.offsetX, e.offsetY];
				proximity.x = lastX;
				proximity.y = lastY;
				HISTORY_STACK.push({ "shape": "rectangle", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": this.ctx.lineWidth});
			});
		})
		return square_container;
	}

	arrowsVTool(){
		let square_container = document.createElement('div');
		const arrows_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-arrows-v';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		arrows_button.appendChild(icon);
		square_container.appendChild(arrows_button);
		this.toolBox.appendChild(square_container);
		arrows_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'move';

			let proximity_arr = new PriorityQueue();//min heap priority que
			let proximity = null;
			let lastX = 0;
			let lastY = 0;
			let isDrawing = false;
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			let mouseDown = (e) => {
				//when this is clicked it will get the info of 
				//the drawing nearest to it 
				//TODO:- complete priority que 
				let x = e.offsetX;
				let y = e.offsetY;
				isDrawing = true;
				for (let drawing of HISTORY_STACK){
					let near = distance(x,y, drawing.x, drawing.y) 
					drawing['near'] = near
					proximity_arr.push(drawing);
				}
				let shape_params = proximity_arr.pop();
				proximity = shape_params;
				this.ctx.clearRect(shape_params.x - 1, shape_params.y - 1, shape_params.length + 1, shape_params.length + 1);
				this.ctx.beginPath();
				this.ctx.rect(x, y, shape_params.length, shape_params.length);
				this.ctx.stroke();
				this.ctx.closePath();
				[lastX, lastY] = [x, y];
			};
			let mouseMove = (e) => {
				if (!proximity) return;
				this.ctx.clearRect(lastX-1, lastY-1, proximity.length+1, proximity.length+1);
				this.ctx.beginPath();
				this.ctx.rect(e.offsetX, e.offsetY, proximity.length, proximity.length);
				this.ctx.stroke();
				this.ctx.closePath();
				[lastX, lastY] = [e.offsetX, e.offsetY];
			};
			canvas.addEventListener('mousedown', mouseDown);

			canvas.addEventListener('mousemove', mouseMove);

			canvas.addEventListener('mouseup',(e)=>{
				canvas.removeEventListener('mousemove', mouseMove);
				[lastX, lastY] = [e.offsetX, e.offsetY];
				proximity.x = lastX;
				proximity.y = lastY;
				HISTORY_STACK.push();
			});
		})
		return square_container;
	}

	eraserTool(){
		let svg = `<svg fill="#000000" height="25px" width="25px" version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="-1117 883 256 256" xml:space="preserve">
<path d="M-1016.4,1091.3l113.9-113.9c13.5-13.5,13.5-35.3,0-48.8l-32.5-32.5c-13.5-13.5-35.3-13.5-48.8,0l-113.9,113.9
        c-13.5,13.5-13.5,35.3,0,48.8l32.5,32.5C-1051.7,1104.8-1029.9,1104.8-1016.4,1091.3z M-1057.1,1083.2l-32.5-32.5
        c-9-9-9-23.6,0-32.5l67.6-68.1l65.1,65.1l-67.6,68.1c-4.3,4.3-10.1,6.7-16.3,6.7C-1046.9,1089.9-1052.7,1087.6-1057.1,1083.2z
         M-954.3,1129.7c0,3.5-2.8,6.3-6.3,6.3h-89.3c-3.5,0-6.3-2.8-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3h89.3
        C-957.1,1123.4-954.3,1126.2-954.3,1129.7z M-882.3,1129.7c0,3.4-2.9,6.3-6.3,6.3c-3.5,0-6.3-2.9-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3
        C-885.2,1123.4-882.3,1126.2-882.3,1129.7z M-907.5,1129.7c0,3.4-2.9,6.3-6.3,6.3c-3.5,0-6.3-2.9-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3
        C-910.4,1123.4-907.5,1126.2-907.5,1129.7z M-932.7,1129.7c0,3.4-2.9,6.3-6.3,6.3c-3.5,0-6.3-2.9-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3
        C-935.6,1123.4-932.7,1126.2-932.7,1129.7z M-944.5,1107.9c0,3.5-2.8,6.3-6.3,6.3h-51.1c-3.5,0-6.3-2.8-6.3-6.3
        c0-3.5,2.8-6.3,6.3-6.3h51.1C-947.4,1101.6-944.5,1104.4-944.5,1107.9z M-894.9,1107.9c0,3.4-2.9,6.3-6.3,6.3
        c-3.5,0-6.3-2.9-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3C-897.8,1101.6-894.9,1104.4-894.9,1107.9z M-920.1,1107.9c0,3.4-2.9,6.3-6.3,6.3
        c-3.5,0-6.3-2.9-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3C-923,1101.6-920.1,1104.4-920.1,1107.9z M-869.6,1107.9c0,3.4-2.9,6.3-6.3,6.3
        c-3.5,0-6.3-2.9-6.3-6.3c0-3.5,2.8-6.3,6.3-6.3C-872.6,1101.6-869.6,1104.4-869.6,1107.9z"/>
</svg>` 
		const eraser_button = html.button(svg, 'Eraser Tool');
		let area = 20;
		let isErasing = false;
		this.toolBox.appendChild(eraser_button);
		eraser_button.addEventListener('click',()=>{
			this.canvas.style.cursor = 'move';
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';

			let mouseDown = (e) => {
				if (isErasing) return
				isErasing = true;
			};
			let mouseMove = (e) => {
				if (!isErasing) return
				let x = e.offsetX;
				let y = e.offsetY;
				console.log(x,y)
				this.ctx.clearRect(x,y, area, area)
			};
			canvas.addEventListener('mousedown', mouseDown);
			canvas.addEventListener('mousemove', mouseMove);
		})
		return eraser_button;
	}

	selectionTool(){
		let svg =`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="non
e" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" cla
ss="feather feather-mouse-pointer"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path
><path d="M13 13l6 6"></path></svg>`;
		const selection_button = html.button(svg, 'Selection Tool');
		let isSelecting = false;
		this.toolBox.appendChild(selection_button);
		selection_button.addEventListener('click',(e)=>{
			this.canvas.style.cursor = 'auto';
			let initialX = e.offsetX;
			let initialY = e.offsetY;
			let lastX = e.offsetX;
			let lastY = e.offsetY;
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			//TODO: after reclicking it startes drawing from the clicked area

			let mouseDown = (e) => {
				if (isSelecting) return
				isSelecting = true;
				initialX = e.offsetX;
				initialY = e.offsetY;
				lastX = e.offsetX;
				lastY = e.offsetY;
			};
			let mouseMove = (e) => {
				if (!isSelecting) return
				this.ctx.clearRect(initialX - 1, initialY - 1, initialX - lastX + 1, initialY - lastY + 1);
				this.ctx.beginPath();
				this.ctx.fillStyle = 'rgba(1,1,1,0.4)';
				this.ctx.strokeStyle = 'blue';
				this.ctx.lineWidth = 2;
				this.ctx.fillRect(initialX-1, initialY-1, e.offsetX - initialX - 1, e.offsetY - initialY - 1);
				this.ctx.rect(initialX, initialY, e.offsetX - initialX, e.offsetY - initialY);
				[lastX, lastY] = [e.offsetX, e.offsetY];
				this.ctx.stroke();
				this.ctx.closePath();
			};

			let mouseUp = () => {
				canvas.removeEventListener('mousedown', mouseDown);
				canvas.removeEventListener('mousemove', mouseMove);
				canvas.removeEventListener('mouseup', mouseUp);
			};
			canvas.addEventListener('mousedown', mouseDown);
			canvas.addEventListener('mousemove', mouseMove);
			canvas.addEventListener('mouseup', mouseUp);
		})
		return selection_button;
	}

	textTool(){
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-type"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`;
		const text_button = html.button(svg, 'Text Tool');
		let isActive = false;
		let initialX = 0;
		let initialY = 0;

		this.toolBox.appendChild(text_button);
		let word = ''
		let mouseDown = (e) => {
			this.ctx.beginPath();
			this.ctx.strokeStyle = this.globalColor;
			initialX = e.offsetX;
			initialY = e.offsetY;
			this.ctx.rect(e.offsetX, e.offsetY, 200, 10 );
			this.ctx.stroke()
			this.ctx.closePath()

		};

		const keyHandler = (event)=>{
			console.log(event.key)
			//TODO:
			//half of the font size should be added to move 
			//the char 
			//need to save the char details for every cell
			//for removing process
			if (event.key.length == 1){
				this.ctx.font = "20px sans-serif"
				this.ctx.fillStyle = "white";
				render(canvas);
				word+=event.key
				this.ctx.fillText(word, initialX, initialY+9);
			}
			if (event.key === 'Escape'){
				HISTORY_STACK.push({ "shape": "text", word, 'x': initialX, 'y': initialY+9 });
				document.removeEventListener( 'keydown', keyHandler);
			}

			if (event.key === 'Backspace'){
				word = word.slice(0,-1)
				render(canvas)
				this.ctx.fillText(word, initialX, initialY+9);
			}
		};
		text_button.addEventListener('click',()=>{
			this.canvas.style.cursor = 'text';
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';



			if (!isActive){
				console.log(isActive)
				this.canvas.addEventListener('mousedown', mouseDown);
				document.addEventListener('keydown', keyHandler);
				isActive = true;
			}else{
				console.log(isActive)
				this.canvas.removeEventListener('mousedown', mouseDown);
				document.removeEventListener('keydown', keyHandler);
				isActive = false;
			}
		})
		return text_button;
	}

	moveTool(){
		let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="non
			e" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" cla
			ss="feather feather-move"><polyline points="5 9 2 12 5 15"></polyline><polyline points="9 5 
			12 2 15 5"></polyline><polyline points="15 19 12 22 9 19"></polyline><polyline points="19 9 
			22 12 19 15"></polyline><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2=
			"12" y2="22"></line></svg>`;
		const move_button = html.button(svg, 'Move Tool');

		this.toolBox.appendChild(move_button);
		move_button.addEventListener('click',()=>{
			this.canvas.style.cursor = 'move';

			let proximity_arr = new PriorityQueue();//min heap priority que
			let proximity = null;
			let lastX = 0;
			let lastY = 0;
			let isDrawing = false;
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			let mouseDown = (e) => {
				//when this is clicked it will get the info of 
				//the drawing nearest to it 
				//TODO:- complete priority que 
				let x = e.offsetX;
				let y = e.offsetY;
				isDrawing = true;
				for (let idx in HISTORY_STACK){
					console.log(idx)
					let drawing = HISTORY_STACK[idx];
					let near = distance(x,y, drawing.x1, drawing.y1); 
					proximity_arr.push({ drawing, idx, near });
				}
				const { drawing, near, idx } = proximity_arr.pop();
				//deque create it for use ..
				console.log(' length before-->',HISTORY_STACK.length)
				HISTORY_STACK.slice(idx,1);
				console.log(' length after --->',HISTORY_STACK.length);
				proximity = drawing;
				console.log(proximity);
			};
			let mouseMove = (e) => {
				if (!proximity) return;
				render(canvas);
				console.log('yay')
				//shape_creator[proximity.shape](e.offsetX, e.offsetY, e.offsetX + (proximity.x2 - proximity.x1), e.offsetY + (proximity.y2 - proximity.y1), this.ctx);
				proximity.x2 = e.offsetX + (proximity.x2 - proximity.x1);
				proximity.y2 = e.offsetY + (proximity.y2 - proximity.y1);
				proximity.x1 = e.offsetX;
				proximity.y1 = e.offsetY;

			};
			canvas.addEventListener('mousedown', mouseDown);

			canvas.addEventListener('mousemove', mouseMove);

			canvas.addEventListener('mouseup',()=>{
				proximity = null;
			});
		})
		return move_button;
	}

	saveTool(){
		let square_container = document.createElement('div');
		const save_button = document.createElement('button');
		var icon = document.createElement('i');
		save_button.title = 'Save tool to save current file'
		icon.className = 'fa fa-save';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		save_button.appendChild(icon);
		square_container.appendChild(save_button);
		this.toolBox.appendChild(square_container);
		save_button.addEventListener('click',()=>{
			let state = JSON.stringify(HISTORY_STACK, null, 2);
			const blob = new Blob([state], { type: "application/json" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "Draw-scrib.dscr";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);

		})
		return square_container;
	}


	openFileTool(){
		let square_container = document.createElement('div');
		const save_button = document.createElement('input');
		save_button.type = "file";
		var icon = document.createElement('i');
		icon.className = 'fa fa-folder-open-o';
		icon.style.fontSize = '25px';
		icon.style.cursor = 'pointer';
		//save_button.appendChild(icon);
		square_container.appendChild(save_button);
		this.toolBox.appendChild(square_container);
		save_button.addEventListener('change',()=>{
			this.ctx.strokeStyle = this.globalColor;
			const file = save_button.files[0];
			if (file){
				const reader = new FileReader();
				reader.onload = (e) => {
					const dta = JSON.parse(e.target.result);
					for(let obj of dta){
						HISTORY_STACK.push(obj);
					}
					console.log(HISTORY_STACK);
					render(canvas);
				}
				reader.readAsText(file); //start reading the file
			}
		})
		return square_container;
	}

	opacityTool(){
		const slider_container = document.createElement('div');
		const input_slider = document.createElement('input');
		slider_container.appendChild(input_slider);
		input_slider.type = 'range';
		input_slider.id = "slider";
		input_slider.min = '0.0';
		input_slider.max = '1.0';
		input_slider.step = '0.1';
		input_slider.value = '0.5';
		slider_container.style.backgroundColor = '#fff';

		this.toolBox.appendChild(slider_container);
		input_slider.addEventListener('change', (e) => {
			let opacity = e.target.value;
			this.canvas.style.opacity = ''+opacity;
		});

	}

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
	console.log(event.ctrlKey, event.altKey, event.metaKey, !debug_state);

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
tool_box.opacityTool();

