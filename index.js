const page = document.body;

function canvas_element(){
	const canvas = document.createElement('canvas');
	canvas.id = 'canvasid';
	canvas.style.backgroundColor = 'rgba(0,0,0,1)';
	canvas.style.opacity = '0.5';
	canvas.style.position = 'absolute';
	canvas.style.zIndex = '1';
	canvas.style.width = '100%';
	canvas.style.height = '100%';
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
		this.toolBox = document.createElement('div');
	}

	outerBox(){
		console.log('outer - box');
		this.toolBox.style.backgroundColor = 'rgba(244,244,244,1)';
		this.toolBox.id = 'tool-box';
		this.toolBox.style.position = 'absolute';
		this.toolBox.style.zIndex = '5';
		this.toolBox.style.display = 'flex';
		this.toolBox.style.justifyContent = 'space-between';
		this.toolBox.style.width = '50px';
		this.toolBox.style.height = '50px';
		this.toolBox.style.border = '1px solid';
		//this.toolBox.style.display = 'flex';
		return this.toolBox;
	}

	outerBoxMove(){
		console.log('Moving...');
		let isDragging = false;
		let offsetX = '500';
		let offsetY = '500'

		this.toolBox.addEventListener('mousedown', (e)=>{
			e.preventDefault();
			console.log('Started moving ..')
			isDragging = true;
			offsetX = e.clientX - this.toolBox.offsetLeft;
			offsetY = e.clientY - this.toolBox.offsetTop;
		});

		this.toolBox.addEventListener('mousemove', (e)=>{
			console.log(isDragging);
			console.log();
			if (isDragging){
				let x = e.clientX - offsetX;
				let y = e.clientY - offsetY;
				this.toolBox.style.top = `${x}px`;
				this.toolBox.style.left = `${y}px`;
			}
		});

		document.addEventListener('mouseup', ()=>{
			isDragging = false;
		});
	}



}

let tool_box = new ToolBarNew();
page.appendChild(tool_box.outerBox());
tool_box.outerBoxMove();
