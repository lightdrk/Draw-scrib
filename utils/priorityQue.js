class PriorityQueue{
	//complete priority ques
	constructor(x, y) {
		this.root = [];
		this.cordX = x;
		this.cordY = y;
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
		while (idx>0 && this.root[idx] < this.root[this.parent(idx)]){
			let val = this.root[idx];
			this.root[idx] = this.root[this.parent(idx)];
			this.root[this.parent(idx)] = val;
		}
	}

	heapify_down(idx){
		let left = this.left(idx);
		let right = this.right(idx);
		let smallest = idx
		let length = this.root.length;
		if (left < length && this.root[idx] > this.root[left]){
			smallest = left;
		}
		if (right < length && this.root[smallest] > this.root[right]){
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
			this.root[0], val = val, this.root[0];
			this.heapify_down(0);
		}
		return val;
	}

	peek(){
		return this.root[0];
	}
}
