
export function render(canvas){
	console.log('rendering')
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0,0, canvas.width, canvas.height);
	console.log(HISTORY_STACK);
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
