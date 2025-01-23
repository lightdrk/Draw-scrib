class ToolBar{
	constructor(){
		this.toolBox = document.createElement('div');
	}

	outerBox(){
		this.toolBox.style.backgroundColor = 'rgba(244,244,244,1)';
		this.toolBox.id = 'tool-box';
		this.toolBox.style.position = 'absoulute';
		this.toolBox.style.zIndex = '5';
		this.toolBox.style.display = 'flex';
		this.toolBox.style.justifyContent = 'space-between';
		this.toolBox.style.width = '10%';
		this.toolBox.style.height = '30%';
		//this.toolBox.style.display = 'flex';
	}

	outerBoxMove(){
		let isDragging = false;
		let offsetX = 0
		let offsetY = 0

		this.toolBox.addEventListener('mousedown', (e)=>{
			e.preventDefault();
			this.Dragging = true;
			offsetX = e.clientX - this.toolBox.offsetLeft;
			offsetY = e.clientY - this.toolBox.offsetTop;
		});

		this.toolBox.addEventListener('mousemove', ()=>{
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

exports = ToolBar;
