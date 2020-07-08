class Circle {
	center = {x:null, y:null};
	radius = null;
	defaultContext = null;

	constructor(center, radius, ctx) {
		this.setCenter(center);
		this.setRadius(radius);
		if (ctx !== undefined) {
			this.setContext(ctx);
		}
	}

	setContext(ctx) {
		this.defaultContext = ctx;
	}
	getContext() {
		return this.defaultContext;
	}
	setCenter(center) {
		// we should check that this is a valid {x, y} object, but I do enjoy assuming perfect users ;)
		this.center = JSON.parse(JSON.stringify(center));
	}
	getCenter() {
		return this.center;
	}
	setRadius(radius) {
		this.radius = radius;
	}
	getRadius() {
		return this.radius;
	}

	draw(ctx) {
		if (ctx === undefined) {
			ctx = this.defaultContext;
		}

		ctx.beginPath();
		// this.center is the center of the circle, move the pen back to that point offset by the radius.
		ctx.moveTo(this.center.x+this.radius, this.center.y);
		ctx.arc(this.center.x, this.center.y, this.radius, 0, (Math.PI/180)*360, false );
		ctx.stroke();
	}

	drawPoints(num) {
		// This will calculate the degrees between each point for num number of points on the circle.
		var degreesDelta = 360 / num;
		var nextPointDegree = 0;
		var ctx = this.defaultContext;
		var ptRadius = 3;

		for (var i = 0; i < num; i++) {
			var originOfPoint = this.findPointOnCircle(this.center.x, this.center.y, this.radius, nextPointDegree);
			// crudely draw the tiny circle point
			// It might be worth tracking these points in an array.
			ctx.beginPath();
			ctx.moveTo(originOfPoint.x+ptRadius, originOfPoint.y);
			ctx.arc(originOfPoint.x, originOfPoint.y, ptRadius, 0, (Math.PI/180)*360, false );
			ctx.stroke();

			// move to the next point offset
			nextPointDegree += degreesDelta;
		}
	}

	// Given the origin point of the circle, its radius and the angle in Radians (degrees * Math.PI / 180)
	// it returns the a point object showing the x,y coordinates of the point on a circle.
	// Reference: https://www.coderslexicon.com/code/59/
	findPointOnCircle(originX, originY , radius, degrees) {
		var angleRadians = (degrees * Math.PI / 180);
		var newX = radius * Math.cos(angleRadians) + originX
		var newY = radius * Math.sin(angleRadians) + originY

		return {x : newX, y : newY}
	}


}