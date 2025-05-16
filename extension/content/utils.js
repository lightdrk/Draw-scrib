function distance(x1,y1, x2,y2){
	return (x2-x1)**2 + (y2-y1)**2;

}

export class ToolBarNew{
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
		this.toolBox.style.zIndex = '999999';
		this.toolBox.style.display = 'flex';
		this.toolBox.style.justifyContent = 'space-between';
		this.toolBox.style.top = '0';
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
		slider_container.style.zIndex = '999999';
		slider_container.style.top = '0'
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
				ctx.beginPath();
				for (let i = 0; i < 6; i++) {
				  const angle = Math.PI / 3 * i;
				  const x = centerX + size * Math.cos(angle);
				  const y = centerY + size * Math.sin(angle);
				  if (i === 0) {
					ctx.moveTo(x, y);
				  } else {
					ctx.lineTo(x, y);
				  }
				}
				ctx.closePath();
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
		icon.style.scale = '1.3';
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

	lineTool(){
		let square_container = document.createElement('div');
		const arrows_button = document.createElement('button');
		var icon = document.createElement('i');
		icon.className = 'fa fa-minus';
		icon.style.fontSize = '25px';

		icon.style.cursor = 'pointer';
		arrows_button.appendChild(icon);
		square_container.appendChild(arrows_button);
		this.toolBox.appendChild(square_container);


		let lineToolActive = false;
	
		arrows_button.addEventListener('click',()=>{
			let canvas = document.getElementById('canvasid');
			let ctx = canvas.getContext('2d');
			canvas.style.cursor = 'crosshair';
			let lastX = null;
			let lastY = null;

			let mouseDown = (e) => {
				console.log(ctx);
				if (lastX & lastY){
					shape_creator["line"](lastX, lastY, e.offsetX, e.offsetY, ctx);
					HISTORY_STACK.push({ "shape": "line", x2: e.offsetX, y2: e.offsetY, x1: lastX, y1: lastY, "lineWidth": ctx.lineWidth});
					lastX = null;
					lastY = null;
					return
				}
				lastX = e.offsetX;
				lastY = e.offsetY;
			};

			if (! lineToolActive){
				canvas.addEventListener('mousedown', mouseDown);
				lineToolActive = true;
			}
		})
		return square_container;
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
			let lastX = 0;
			let lastY = 0;
			let word = '' //Array.from("");// buffer fro efficency
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

			const keyHandler = (event)=>{
				console.log(event.key)
				//TODO:
				//half of the font size should be added to move 
				//the char 
				//need to save the char details for every cell
				//for removing process
				if (event.key.length == 1){
					ctx.font = "20px sans-serif"
					ctx.fillStyle = "white";
					render(canvas);
					word+=event.key
					ctx.fillText(word, initialX, initialY+9);
				}
				if (event.key === 'Escape'){
					HISTORY_STACK.push({ "shape": "text", word, 'x': initialX, 'y': initialY+9 });
					document.removeEventListener( 'keydown', keyHandler);
				}

				if (event.key === 'Backspace'){
					word = word.slice(0,-1)
					render(canvas)
					ctx.fillText(word, initialX, initialY+9);
				}
			};

			canvas.addEventListener('mousedown', mouseDown);
			document.addEventListener('keydown', keyHandler);
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
				console.log("moving");
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
				//shape_creator[proximity.shape](e.offsetX, e.offsetY, e.offsetX + (proximity.x2 - proximity.x1), e.offsetY + (proximity.y2 - proximity.y1), ctx);
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
		return square_container;
	}

	saveTool(){
		let square_container = document.createElement('div');
		const save_button = document.createElement('button');
		var icon = document.createElement('i');
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

			let canvas = document.getElementById('canvasid');
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

}
