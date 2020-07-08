class Canvas {
	canvas = null;
	context = null;

	constructor(id) {
		this.setCanvas( document.getElementById(id) );
		this.setContext( this.canvas.getContext('2d') );
	}

	setCanvas(canvas) {
		this.canvas = canvas;
	}
	getCanvas() {
		return this.canvas;
	}
	setContext(ctx) {
		this.context = ctx;
	}
	getContext() {
		return this.context;
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}