export const shape_creator = {
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
