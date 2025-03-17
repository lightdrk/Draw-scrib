const pq = require('./utils/priorityQue');
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

function moveShape(){

}

class ToolBarNew{
	constructor(){
		this.moverBox = document.createElement('div');
		this.toolBox = document.createElement('div');
		this.corner = document.createElement('div');
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

		pen_container.addEventListener('click',() => {
			let x = document.getElementById('canvasid');
			if (!update){
				let lastX = 0;
				let lastY = 0;
				let isDrawing = false;
				let canvas = document.getElementById('canvasid');
				x.style.cursor = 'crosshair';
				let ctx = canvas.getContext('2d');
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				update = true;
				canvas.addEventListener('mousedown', (e)=>{
					isDrawing = true;
					ctx.beginPath();
					console.log(e.offsetX, e.offsetY);
					[lastX, lastY] = [e.offsetX, e.offsetY];
				});
				canvas.addEventListener('mouseup',()=>{
					isDrawing = false;
				});
				canvas.addEventListener('mousemove', (e)=>{
					if (!isDrawing) return;
					ctx.strokeStyle = 'rgba(255,255,255,1)';

					ctx.moveTo(lastX, lastY);
					ctx.lineTo(e.offsetX, e.offsetY);
					ctx.stroke();
					[lastX, lastY] = [e.offsetX, e.offsetY]
				});

			}else{
				x.style.cursor = 'auto';
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
		square_button.addEventListener('click',()=>{
			isActive = !isActive
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
					console.log(e.offsetX, lastX) 
					console.log(e.offsetY, lastY)
					ctx.beginPath();
					ctx.strokeStyle = 'rgba(255,255,255,1)';
					let length = Math.floor(Math.sqrt(((e.offsetX - lastX)**2 + (e.offsetY - lastY)**2) / 2));
					ctx.rect(lastX, lastY, length, length)
					ctx.stroke();
					ctx.closePath();
					HISTORY_STACK.push([[length, length], [lastX, lastY]]);
					[lastX, lastY] = [e.offsetX, e.offsetY]

				});
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
		circle_container.addEventListener('click',()=>{
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
					ctx.beginPath();					console.log(e.offsetX, lastX) 

					[lastX, lastY] = [e.offsetX, e.offsetY]
				});

				canvas.addEventListener('mousemove', ()=>{
					if (!isDrawing) return;
				});

				canvas.addEventListener('mouseup',(e)=>{
					console.log(e.offsetX, lastX); 
					console.log(e.offsetY, lastY);
					ctx.strokeStyle = 'rgba(255,255,255,1)';
					let length = Math.sqrt(((e.offsetX - lastX)**2 + (e.offsetY - lastY)**2) / 2)
					ctx.arc(lastX, lastY, length, 0, 2*Math.PI );
					ctx.stroke();
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
		return hexagon_container;
	}

	triangleTool(){
		let triangle_container = document.createElement('div');
		const square_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-triangle';
		icon.style.fontSize = '25px';
		icon.style.cursor = 'pointer';
		square_button.appendChild(icon);
		triangle_container.appendChild(square_button);
		this.toolBox.appendChild(triangle_container);
		return triangle_container;
	}

	colorBox(){
		let colorBoxDiv = document.createElement('div');
		const colorInput = document.createElement('input');
		colorInput.setAttribute('type', 'color');
		colorBoxDiv.appendChild(colorInput);
		this.toolBox.appendChild(colorBoxDiv);
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

	moveTool(){
		let square_container = document.createElement('div');
		const square_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-arrows';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		square_button.appendChild(icon);
		square_container.appendChild(square_button);
		this.toolBox.appendChild(square_container);
		square_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			canvas.style.cursor = 'move';
				let lastX = 0;
				let lastY = 0;
				let isDrawing = false;
				let ctx = canvas.getContext('2d');
				ctx.lineJoin = 'round';
				ctx.lineCap = 'round';
				canvas.addEventListener('mousedown', (e)=>{
					//when this is clicked it will get the info of 
					//the drawing nearest to it 
					//TODO:- complete priority que 
					isDrawing = true;
					let proximity = new pq();//min heap priority que
					for (let drawing of HISTORY_STACK){
						proximity.push(drawing);
					}
					[lastX, lastY] = [e.offsetX, e.offsetY]
				});

				canvas.addEventListener('mousemove', ()=>{
					if (!isDrawing) return;
				});

				canvas.addEventListener('mouseup',(e)=>{
					console.log(e.offsetX, lastX) 
					console.log(e.offsetY, lastY)
					ctx.strokeStyle = 'rgba(255,255,255,1)';
					let length = Math.sqrt(((e.offsetX - lastX)**2 + (e.offsetY - lastY)**2) / 2)
					console.log(length)
					ctx.rect(lastX, lastY, length, length)
					ctx.stroke();
					[lastX, lastY] = [e.offsetX, e.offsetY]
				});
		})
		return square_container;
	}

}

document.addEventListener('keydown', (event)=>{
	if ((event.ctrlKey || event.metaKey) && event.key === 'z'){
		let canvas = document.getElementById('canvasid');
		canvas.style.cursor = 'crosshair';
		let ctx = canvas.getContext('2d');
		console.log(HISTORY_STACK);
		[lengths, cord] = HISTORY_STACK.pop();
		REDO_STACK.push([lengths, cord])
		ctx.clearRect(cord[0]-1,cord[1]-1, lengths[0]+1, lengths[1]+1);

	}

	if ((event.ctrlKey || event.metaKey) && event.key === 'u'){
		let canvas = document.getElementById('canvasid');
		canvas.style.cursor = 'crosshair';
		let ctx = canvas.getContext('2d');
		[lengths, cord] = REDO_STACK.pop();
		HISTORY_STACK.push([lengths, cord])
		ctx.clearRect(cord[0]-1,cord[1]-1, lengths[0]+1, lengths[1]+1);

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
tool_box.strokeBox();
page.appendChild(tool_box.outerBox());

tool_box.outerBoxMove();
