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
	}
}


const page = document.body;

const HISTORY_STACK = [];
const REDO_STACK = [];

function canvas_element(){
	const canvas = document.createElement('canvas');
	canvas.id = 'canvasid';
	canvas.style.backgroundColor = 'rgba(0,0,0,1)';
	canvas.style.opacity = '0.5';
	canvas.style.position = 'absolute';
	canvas.style.zIndex = '1';
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	return canvas
}

function slider(){
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
	slider_container.style.zIndex = '5';
	return slider_container;
}


let canvas = canvas_element();
let slid = slider()


page.appendChild(canvas);

page.appendChild(slid);
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

class ToolBarNew{
	constructor(){
		this.moverBox = document.createElement('div');
		this.toolBox = document.createElement('div');
		this.corner = document.createElement('div');
		this.canvas = document.getElementById('canvasid');
		this.ctx = this.canvas.getContext('2d');
		this.globalColor = 'rgba(255,255,255,1)';
	}

	outerBox(){
		this.moverBox.style.padding = '5px';
		this.moverBox.style.backgroundColor = 'rgba(0,0,0,0.5)';
		this.moverBox.style.cursor = 'move';
		this.toolBox.style.flexDirection = 'column';
		this.toolBox.style.backgroundColor = 'rgba(244,244,244,1)';
		this.toolBox.id = 'tool-box';
		this.toolBox.style.position = 'absolute';
		this.toolBox.style.zIndex = '5';
		this.toolBox.style.display = 'flex';
		this.toolBox.style.justifyContent = 'space-between';
		this.toolBox.style.border = '1px solid';
		//this.moverBox.appendChild(this.toolBox);
		this.toolBox.appendChild(this.moverBox);
		return this.toolBox;
	}

	outerBoxMove(){
		let isDragging = false;
		let offsetX = '500';
		let offsetY = '500'

		this.moverBox.addEventListener('mousedown', (e)=>{
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
		});
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
		slider_container.style.zIndex = '5';
		return slider_container;
	}

	penTool(){
		const pen_container = document.createElement('div');
		pen_container.id = 'pen'
		let update=false;
		//let lastX = 0;
		//let lastY = 0;
		let isDrawing = false;
		let trace = null;
		let mouseDown = (e)=>{
			isDrawing = true;
			ctx.beginPath();
			if (!trace){
				console.log('1')
				trace = [];
			}
			trace.push([e.offsetX, e.offsetY]);
			//[lastX, lastY] = [e.offsetX, e.offsetY];
		}

		let mouseMove = (e)=>{
			if (!isDrawing) return;
			ctx.strokeStyle = this.globalColor;
			//ctx.moveTo(lastX, lastY);
			ctx.lineTo(e.offsetX, e.offsetY);
			trace.push([e.offsetX, e.offsetY]);
			ctx.stroke();
			//[lastX, lastY] = [e.offsetX, e.offsetY]
		}

		let mouseUp = (e)=>{
			ctx.closePath();
			HISTORY_STACK.push({ "shape": "pen", trace, "lineWidth": ctx.lineWidth})
			trace = null;
			isDrawing = false;
		}

		let x = document.getElementById('canvasid');

		let canvas = document.getElementById('canvasid');
		x.style.cursor = 'crosshair';
		let ctx = canvas.getContext('2d');
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		pen_container.addEventListener('click',() => {
			if (!update){

				update = true;

				canvas.addEventListener('mousedown', mouseDown);
				canvas.addEventListener('mousemove', mouseMove);
				canvas.addEventListener('mouseup', mouseUp);

			}else{
				x.style.cursor = 'auto';
				canvas.removeEventListener('mousedown', mouseDown);
				canvas.removeEventListener('mousemove', mouseMove);
				canvas.removeEventListener('mouseup', mouseUp);
				update = false;

			}
		});
		const pen_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-pen';
		icon.style.fontSize = '25px';
		icon.style.cursor = 'pointer';
		pen_button.appendChild(icon);
		pen_container.appendChild(pen_button);
		this.toolBox.appendChild(pen_container);

		return pen_container;
	}

	toolContainer(){
		const container = document.createElement('div');

		return container;
	}

	squareTool(){
		let square_container = document.createElement('div');
		const square_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-square';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		square_button.appendChild(icon);
		square_container.appendChild(square_button);
		this.toolBox.appendChild(square_container);
		let isActive = false;

		let lastX = 0;
		let lastY = 0;
		let isDrawing = false;

		let canvas = document.getElementById('canvasid');
		let ctx = canvas.getContext('2d');
		const mouseDown = (e) =>{
			isDrawing = true;
			isActive = true;
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		const mouseMove = (e) =>{
			if (!isDrawing) return;
		};

		const mouseUp = (e) =>{

			ctx.strokeStyle = this.globalColor;
			shape_creator["rectangle"](lastX, lastY, e.offsetX , e.offsetY, ctx);
			HISTORY_STACK.push({ "shape": "rectangle", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": ctx.lineWidth});
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		square_button.addEventListener('click',()=>{

			canvas.style.cursor = 'crosshair';
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';

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
		return square_container;
	}


	circleTool(){
		let circle_container = document.createElement('div');
		const square_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-circle';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		square_button.appendChild(icon);
		circle_container.appendChild(square_button);
		this.toolBox.appendChild(circle_container);
		circle_container.addEventListener('click', ()=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'crosshair';
			let lastX = 0;
			let lastY = 0;
			let isDrawing = false;
			let ctx = canvas.getContext('2d');
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			canvas.addEventListener('mousedown', (e)=>{
				isDrawing = true;

				[lastX, lastY] = [e.offsetX, e.offsetY]
			});

			canvas.addEventListener('mousemove', ()=>{
				if (!isDrawing) return;
			});

			canvas.addEventListener('mouseup',(e)=>{
				ctx.strokeStyle = this.globalColor;
				shape_creator["circle"](lastX, lastY, e.offsetX, e.offsetY, ctx);
				HISTORY_STACK.push({ "shape": "circle", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": lineWidth});
				[lastX, lastY] = [e.offsetX, e.offsetY]

			});
		})
		return circle_container;
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
			this.ctx.lineJoin = 'round';
			this.ctx.lineCap = 'round';
			let isDrawing = false;
			let lastX = 0;
			let lastY = 0;
			this.canvas.addEventListener('mousedown', (e)=>{
				isDrawing = true;
				this.ctx.beginPath();
				[lastX, lastY] = [e.offsetX, e.offsetY];
			});

			this.canvas.addEventListener('mouseup', (e)=>{
				this.ctx.strokeStyle = this.globalColor;
				let top = (e.offsetY-lastY)/4;
				let mid = (lastY - e.offsetY)/2;
				let Xmid = (e.offsetX - lastX)/2;

				this.ctx.moveTo(lastX + Xmid, lastY);
				this.ctx.lineTo(e.offsetX, lastY-top);
				this.ctx.lineTo(e.offsetX, e.offsetY+top);
				this.ctx.lineTo(lastX+top,e.offsetX-top);
			//	this.ctx.lineTo(lastX+Xmid,e.offsetY);

			//	this.ctx.lineTo(lastX, e.offsetY+top);
			//	this.ctx.lineTo(lastX, lastY-top);
			//	this.ctx.lineTo(lastX+Xmid, lastY);
				this.ctx.stroke();
				this.ctx.closePath();

			});
		});
		return hexagon_container;
	}

	triangleTool(){
		let triangle_container = document.createElement('div');
		const square_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-caret-up';
		icon.style.fontSize = '30px';
		icon.style.cursor = 'pointer';
		square_button.appendChild(icon);
		triangle_container.appendChild(square_button);
		this.toolBox.appendChild(triangle_container);
		let isActive = false;
		let lastX = 0;
		let lastY = 0;
		let isDrawing = false;

		let canvas = document.getElementById('canvasid');
		let ctx = canvas.getContext('2d');
		const mouseDown = (e) =>{
			isDrawing = true;
			isActive = true;
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		const mouseMove = (e) =>{
			if (!isDrawing) return;
		};

		const mouseUp = (e) =>{
			ctx.strokeStyle = this.globalColor;
			shape_creator["triangle"](lastX,lastY, e.offsetX, e.offsetY, ctx);
			HISTORY_STACK.push({ "shape": "triangle", "lineWidth": ctx.lineWidth, x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": lineWidth});
			[lastX, lastY] = [e.offsetX, e.offsetY]
		};

		square_button.addEventListener('click',()=>{

			canvas.style.cursor = 'crosshair';
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';

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
		return triangle_container;
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
		strokeBoxDiv.style.display = 'flex';
		strokeBoxDiv.style.alignItems = 'center';
		strokeBoxDiv.style.justifyContent = 'space-between';
		for (let x=5; x <= 20 ;x+=5){
			let stroke = document.createElement('div');
			stroke.style.width = `${x}px`;
			stroke.style.height = `${x}px`;
			stroke.style.cursor = 'pointer';
			stroke.style.borderRadius = `50%`;
			stroke.style.background = '#000';
			stroke.addEventListener('click',()=>{
				let canvas = document.getElementById('canvasid');
				let ctx = canvas.getContext('2d');
				ctx.lineWidth = `${x}`;

			});
			strokeBoxDiv.appendChild(stroke);
		}
		this.toolBox.appendChild(strokeBoxDiv);
		return strokeBoxDiv;
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
			let ctx = canvas.getContext('2d');
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
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
				ctx.clearRect(shape_params.x - 1, shape_params.y - 1, shape_params.length + 1, shape_params.length + 1);
				ctx.beginPath();
				ctx.rect(x, y, shape_params.length, shape_params.length);
				ctx.stroke();
				ctx.closePath();
				[lastX, lastY] = [x, y];
			};
			let mouseMove = (e) => {
				if (!proximity) return;
				ctx.clearRect(lastX-1, lastY-1, proximity.length+1, proximity.length+1);
				ctx.beginPath();
				ctx.rect(e.offsetX, e.offsetY, proximity.length, proximity.length);
				ctx.stroke();
				ctx.closePath();
				[lastX, lastY] = [e.offsetX, e.offsetY];
			};
			canvas.addEventListener('mousedown', mouseDown);

			canvas.addEventListener('mousemove', mouseMove);

			canvas.addEventListener('mouseup',(e)=>{
				canvas.removeEventListener('mousemove', mouseMove);
				[lastX, lastY] = [e.offsetX, e.offsetY];
				proximity.x = lastX;
				proximity.y = lastY;
				HISTORY_STACK.push({ "shape": "rectangle", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": ctx.lineWidth});
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
			let ctx = canvas.getContext('2d');
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
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
				ctx.clearRect(shape_params.x - 1, shape_params.y - 1, shape_params.length + 1, shape_params.length + 1);
				ctx.beginPath();
				ctx.rect(x, y, shape_params.length, shape_params.length);
				ctx.stroke();
				ctx.closePath();
				[lastX, lastY] = [x, y];
			};
			let mouseMove = (e) => {
				if (!proximity) return;
				ctx.clearRect(lastX-1, lastY-1, proximity.length+1, proximity.length+1);
				ctx.beginPath();
				ctx.rect(e.offsetX, e.offsetY, proximity.length, proximity.length);
				ctx.stroke();
				ctx.closePath();
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
		let square_container = document.createElement('div');
		const eraser_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-eraser';
		icon.style.fontSize = '25px';
		let area = 20;
		let isErasing = false;
		icon.style.cursor = 'pointer';
		eraser_button.appendChild(icon);
		square_container.appendChild(eraser_button);
		this.toolBox.appendChild(square_container);
		eraser_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'move';
			let ctx = canvas.getContext('2d');
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';

			let mouseDown = (e) => {
				if (isErasing) return
				isErasing = true;
			};
			let mouseMove = (e) => {
				if (!isErasing) return
				let x = e.offsetX;
				let y = e.offsetY;
				console.log(x,y)
				ctx.clearRect(x,y, area, area)
			};
			canvas.addEventListener('mousedown', mouseDown);
			canvas.addEventListener('mousemove', mouseMove);
		})
		return square_container;
	}

	selectionTool(){
		let square_container = document.createElement('div');
		const selection_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-mouse-pointer';
		icon.style.fontSize = '25px';
		let isSelecting = false;
		icon.style.cursor = 'pointer';
		selection_button.appendChild(icon);
		square_container.appendChild(selection_button);
		this.toolBox.appendChild(square_container);
		selection_button.addEventListener('click',(e)=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'auto';
			let ctx = canvas.getContext('2d');
			let initialX = e.offsetX;
			let initialY = e.offsetY;
			let lastX = e.offsetX;
			let lastY = e.offsetY;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			//TODO: after reclicking it startes drawing from the clicked area

			let mouseDown = (e) => {
				if (isSelecting) return
				isSelecting = true;
				console.log(initialX);
				console.log(initialY);
				initialX = e.offsetX;
				initialY = e.offsetY;
				lastX = e.offsetX;
				lastY = e.offsetY;
			};
			let mouseMove = (e) => {
				if (!isSelecting) return
				ctx.clearRect(initialX - 1, initialY - 1, initialX - lastX + 1, initialY - lastY + 1);
				ctx.beginPath();
				ctx.fillStyle = 'rgba(1,1,1,0.4)';
				ctx.strokeStyle = 'blue';
				ctx.lineWidth = 2;
				ctx.fillRect(initialX-1, initialY-1, e.offsetX - initialX - 1, e.offsetY - initialY - 1);
				ctx.rect(initialX, initialY, e.offsetX - initialX, e.offsetY - initialY);
				[lastX, lastY] = [e.offsetX, e.offsetY];
				ctx.stroke();
				ctx.closePath();
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
		return square_container;
	}

	textTool(){
		let square_container = document.createElement('div');
		const text_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.innerText = 'T';
		icon.style.fontSize = '25px';

		let initialX = 0;
		let initialY = 0;
		icon.style.cursor = 'pointer';
		text_button.appendChild(icon);
		square_container.appendChild(text_button);
		this.toolBox.appendChild(square_container);
		text_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			let ctx = canvas.getContext('2d');
			canvas.style.cursor = 'text';
			let word = ''
			let lastX = 0;
			let lastY = 0;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			let mouseDown = (e) => {
				ctx.beginPath();
				ctx.strokeStyle = this.globalColor;
				initialX = e.offsetX;
				initialY = e.offsetY;
				ctx.rect(e.offsetX, e.offsetY, 200, 10 );
				ctx.stroke()
				ctx.closePath()

			};
			canvas.addEventListener('mousedown', mouseDown);
			document.addEventListener('keydown', (event)=>{
				//TODO:
				//half of the font size should be added to move 
				//the char 
				//need to save the char details for every cell
				//for removing process
				if (event.key.length == 1){
					ctx.font = "20px sans-serif"
					ctx.fillStyle = "white";
					let text_width = ctx.measureText(word).width;
					ctx.clearRect(initialX+1, initialY - 10+1, text_width, 10);
					word+=event.key
					ctx.fillText(word, initialX, initialY+9);
				}

				if (event.key === 'Backspace'){
					let n = ''
					let len = word.length-1
					for (let i= 0; i< len; i++){
						n+=word[i]
					}
					let text_width = ctx.measureText(word).width;
					console.log(ctx.getImageData(initialX,initialY, 50, 50))
					console.log(initialX+1, initialY - 25, text_width, 22)
					ctx.clearRect(initialX+1, initialY - 22, text_width, 22);
					ctx.fillText(n, initialX, initialY+9);
					word = n;
				}
			});
		})
		return square_container;
	}

	moveTool(){
		let square_container = document.createElement('div');
		const move_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-arrows';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		move_button.appendChild(icon);
		square_container.appendChild(move_button);
		this.toolBox.appendChild(square_container);
		move_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'move';

			let proximity_arr = new PriorityQueue();//min heap priority que
			let proximity = null;
			let lastX = 0;
			let lastY = 0;
			let isDrawing = false;
			let ctx = canvas.getContext('2d');
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			let mouseDown = (e) => {
				//when this is clicked it will get the info of 
				//the drawing nearest to it 
				//TODO:- complete priority que 
				let x = e.offsetX;
				let y = e.offsetY;
				isDrawing = true;
				for (let idx in HISTORY_STACK){
					let drawing = HISTORY_STACK[idx];
					let near = distance(x,y, drawing.x1, drawing.y1); 
					proximity_arr.push({ drawing, idx });
				}
				const { drawing, near, idx } = proximity_arr.pop();
				//deque create it for use ..
				let from_behind =  HISTORY_STACK.length - (idx+1);
				let bkp = [];
				while (from_behind != HISTORY_STACK.length){
					bkp.push(HISTORY_STACK.pop())
				}
				bkp.pop()
				while (bkp.length){
					HISTORY_STACK.push(bkp.pop())
				}
				console.log(HISTORY_STACK),
				proximity = drawing;
				[lastX, lastY] = [x, y];
			};
			let mouseMove = (e) => {
				if (!proximity) return;
				ctx.clearRect(0,0, canvas.width, canvas.height);
				for (let shape_data of HISTORY_STACK){
					ctx.lineWidth = shape_data.lineWidth;
					if (shape_data.shape === "pen"){
						shape_creator[shape_data.shape](shape_data.trace, ctx);
					}else{
						shape_creator[shape_data.shape](shape_data.x1, shape_data.y1, shape_data.x2, shape_data.y2, ctx);
					}
				}
				
				shape_creator[proximity.shape](e.offsetX, e.offsetY, e.offsetX + (proximity.x2 - proximity.x1), e.offsetY + (proximity.y2 - proximity.y1), ctx);

			};
			canvas.addEventListener('mousedown', mouseDown);

			canvas.addEventListener('mousemove', mouseMove);

			canvas.addEventListener('mouseup',(e)=>{
				canvas.removeEventListener('mousemove', mouseMove);
				[lastX, lastY] = [e.offsetX, e.offsetY];
				proximity.x1 = lastX;
				proximity.y1 = lastY;
				console.log(proximity);
				HISTORY_STACK.push({ "shape": proximity.shape, x2: e.offsetX + (proximity.x2 - proximity.x1) , y2: e.offsetY + (proximity.y2 - proximity.y1), x1: e.offsetX, y1: e.offsetY, "lineWidth": proximity.lineWidth});
				console.log(HISTORY_STACK);
			});
		})
		return square_container;
	}

}

document.addEventListener('keydown', (event)=>{
	console.log(event.key)
	let canvas = document.getElementById('canvasid');
	let debug_state = document.getElementById('position-debug') ? true : false; 
	if ((event.ctrlKey || event.metaKey) && event.key === 'z'){
		let ctx = canvas.getContext('2d');
		let object = HISTORY_STACK.pop();
		REDO_STACK.push(object)
		console.log(HISTORY_STACK);
		ctx.clearRect(0,0, canvas.width, canvas.height);
		for (let shape_data of HISTORY_STACK){
			ctx.lineWidth = shape_data.lineWidth;
			if (shape_data.shape === "pen"){
				shape_creator[shape_data.shape](shape_data.trace, ctx);
			}else{
				shape_creator[shape_data.shape](shape_data.x1, shape_data.y1, shape_data.x2, shape_data.y2, ctx);
			}
		}
	}

	if ((event.ctrlKey || event.metaKey) && event.key === 'u'){
		let ctx = canvas.getContext('2d');
		if (REDO_STACK.length){
			HISTORY_STACK.push(REDO_STACK.pop());
		}
		ctx.clearRect(0,0, canvas.width, canvas.height);
		for (let shape_data of HISTORY_STACK){
			ctx.lineWidth = shape_data.lineWidth;
			if (shape_data.shape === "pen"){
				shape_creator[shape_data.shape](shape_data.trace, ctx);
			}else{
				shape_creator[shape_data.shape](shape_data.x1, shape_data.y1, shape_data.x2, shape_data.y2, ctx);
			}
		}

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
tool_box.hexagonTool();
tool_box.triangleTool();
tool_box.circleTool();
tool_box.colorBox();
tool_box.moveTool();
tool_box.eraserTool();
tool_box.arrowsTool();
tool_box.arrowsVTool();
tool_box.textTool();
tool_box.selectionTool();
tool_box.strokeBox();
page.appendChild(tool_box.outerBox());

tool_box.outerBoxMove();
