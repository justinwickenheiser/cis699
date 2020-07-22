class Helpers {
	static MOVE = {
		FM: 0,
		BM: 1,
		LT: 2,
		RT: 3,
		FTL: 4,
		MT: 10,
	};
	static OBLIQUE = {
		FL: 11,
		FR: 12,
		BL: 13,
		BR: 14
	}
	static STEP = {
		STND: 5,
		HALF: 6,
		ADJ: 7,
	};
	static HASH = {
		COLLEGE: 8,
		HS: 9,
	};

	// pps: Pixels per Step
	static drawField(pps, obj) {

		if (obj === undefined) {
			obj = {}
		}
		if (obj.layerName === undefined) {
			obj.layerName = "field"
		}
		if (obj.hash === undefined) {
			obj.hash = Helpers.HASH.COLLEGE;
		}

		var rtnLayer = new paper.Layer({
			name: obj.layerName
		});
		// College & Default
		var hashDist = {back: 8, front: 13};
		if (obj.hash == Helpers.HASH.HS) {
			hashDist.back = 7;
			hashDist.front = 14;
		}

		// The field diagram is 197 steps wide
		var fieldWidth = 197 * pps;
		// The field diagram is 111 steps tall
		var fieldHeight = 111 * pps;
		// Some Colors Definitions
		var colors = {
			ltBlue: 'rgba(155, 255, 254, 1)',
			ltGray: 'rgba(179, 179, 179, .8)',
		}

		var singleStep = new paper.Group({
			name: 'singleStep',
			parent: rtnLayer
		});
		// blue cols
		for (var i = 0; i <= 197; i++) {
			singleStep.addChild(new paper.Path.Line({
				from: new paper.Point(i*pps, 0),
				to: new paper.Point(i*pps, fieldHeight),
				strokeColor: colors.ltBlue
			}));
		}
		// blue rows
		for (var i = 0; i <= 111; i++) {
			singleStep.addChild(new paper.Path.Line({
				from: new paper.Point(0, i*pps),
				to: new paper.Point(fieldWidth, i*pps),
				strokeColor: colors.ltBlue
			}));
		}

		

		// ======================================================
		// 4 Step Lines (Gray)
		// 		* Vertical: Offset 2 steps from left & 13 steps from top & are 84 steps long
		// 		There are 49 vertical lines
		// 
		// 		* Horizontal: Offset 18 steps from left & 5 steps from top & are 160 steps long.
		// 		There are 26 horizontal lines.
		// ======================================================
		var fourSteps = new paper.Group({
			name: 'fourSteps',
			parent: rtnLayer
		});
		var vertLineOffset = new paper.Point(2*pps, 13*pps);
		var horzLineOffset = new paper.Point(18*pps, 5*pps);
		// Vertical gray lines
		for (var i = 0; i < 49; i++) {
			fourSteps.addChild(new paper.Path.Line({
				from: vertLineOffset.add( new paper.Point(4*pps*i, 0) ),
				to: vertLineOffset.add( new paper.Point(4*pps*i, 84*pps) ),
				strokeColor: colors.ltGray
			}));
		}
		// Horizontal gray lines 
		for (var i = 0; i < 26; i++) {
			fourSteps.addChild(new paper.Path.Line({
				from: horzLineOffset.add( new paper.Point(0, 4*pps*i) ),
				to: horzLineOffset.add( new paper.Point(160*pps, 4*pps*i) ),
				strokeColor: colors.ltGray
			}));
		}

		// ======================================================
		// Yard Lines / Goal Lines / Side Lines (Gray)
		// 		* Yard/Goal Lines: Offset 13 from top, 18 from left, w/ 8 steps between them
		// 		There are 21 yardlines/goal lines.
		//
		//		* Side Lines: Offset 13 from top, 18 from left, but w/ 84 steps between
		//		There are 2 side lines.
		// ======================================================
		var yardLines = new paper.Group({
			name: 'yardLines',
			parent: rtnLayer
		});
		// The fieldOffset is the Top-Left Point of the main field (corner of side line & goal line)
		var fieldOffset = new paper.Point(18*pps, 13*pps);
		// yardlines / goal lines
		for (var i = 0; i < 21; i++) {
			yardLines.addChild(new paper.Path.Line({
				from: fieldOffset.add( new paper.Point(8*pps*i, 0) ),
				to: fieldOffset.add( new paper.Point(8*pps*i, 84*pps) ),
				strokeColor: 'black',
				name: ( i < 10 ? (5*i)+'_left' : ( i == 10 ?  '50_center' : ( i%10 > 0 ? ((5*i) - (10*(i%10))) + '_right' : 0 + '_right' ) ) )
			}));
		}
		// side lines
		for (var i = 0; i < 2; i++) {
			yardLines.addChild(new paper.Path.Line({
				from: fieldOffset.add( new paper.Point(0, 84*pps*i) ),
				to: fieldOffset.add( new paper.Point(160*pps, 84*pps*i) ),
				strokeColor: 'black',
				name: (i == 0 ? 'back_side_line' : 'front_side_line')
			}));
		}

		// ======================================================
		// HASH MARKS: the hashes are set to College.
		// 		* Adjust the y-value in new Point(x, y): (# * pps)
		//		to allow for HS hashes
		//
		//		College: 
		// 			* Back Hash: Point(x, 8*4*pps) --> Point(x, 32*pps)
		// 			* Front Hash: Point(x, 13*4*pps) --> Point(x, 52*pps)
		//		HS:
		//			* Back Hash: Point(x, 7*4*pps) --> Point(x, 28*pps)
		//			* Front Hash: Point(x, 14*4*pps) --> Point(x, 56*pps)
		// ======================================================
		var hashLines = new paper.Group({
			name: 'hashLines',
			parent: rtnLayer
		});
		// back hash lines (calculated from the top side line)
		for (var i = 0; i < 21; i++) {
			hashLines.addChild(new paper.Path.Line({
				from: fieldOffset.add( new paper.Point((8*pps*i) - (2*pps),  hashDist.back*4*pps) ),
				to: fieldOffset.add( new paper.Point((8*pps*i) - (2*pps) + (4*pps), hashDist.back*4*pps) ),
				strokeColor: 'black'
			}));
		}

		// front hash lines (calculated from the top side line)
		for (var i = 0; i < 21; i++) {
			hashLines.addChild(new paper.Path.Line({
				from: fieldOffset.add( new paper.Point((8*pps*i) - (2*pps),  hashDist.front*4*pps) ),
				to: fieldOffset.add( new paper.Point((8*pps*i) - (2*pps) + (4*pps), hashDist.front*4*pps) ),
				strokeColor: 'black'
			}));
		}

		// ======================================================
		// Field Numbers
		// 		* Back Numbers start 11 steps from Back Side Line
		// 		to bottom of the numbers
		// 
		// 		* Front Numbers start 73 steps from Back Side Line
		// 		to bottom of the numbers
		// ======================================================
		var fieldNumbers = new paper.Group({
			name: 'fieldNumbers',
			parent: rtnLayer
		});
		// back sideline numbers
		for (var i = 0; i < 21; i++) {
			var numberText = new paper.PointText({
				content: ( i < 11 ? 5*i : ( i%10 > 0 ? ((5*i) - (10*(i%10))) : 0 ) ),
				fillColor: 'black',
				fontFamily: 'Arial',
				fontSize: 4*pps,
				rotation: 180,
			});
			numberText.point = fieldOffset.add( new paper.Point((8*pps*i) + (numberText.bounds.width/2),  11*pps) );
			fieldNumbers.addChild( numberText );
		}

		// front sideline numbers
		for (var i = 0; i < 21; i++) {
			var numberText = new paper.PointText({
				content: ( i < 11 ? 5*i : ( i%10 > 0 ? ((5*i) - (10*(i%10))) : 0 ) ),
				fillColor: 'black',
				fontFamily: 'Arial',
				fontSize: 4*pps,
			});
			numberText.point = fieldOffset.add( new paper.Point((8*pps*i) - (numberText.bounds.width/2),  73*pps) );
			fieldNumbers.addChild( numberText );
		}


		// ======================================================
		// Reference Points
		//		These will be a group in the field layer that houses important points 
		//		that can be used for easier offset vector arithmatic.
		//
		//		For every yardline (including goal lines), get the point that interesects
		//		the Back Side Line, Back Hash, Front Hash, Front Side Line
		//
		//		Don't need to do the center, because Each yard line (Path.Line) has a .position which is the center
		// ======================================================
		var fieldReferences = new paper.Group({
			name: 'fieldReferences',
			parent: rtnLayer
		});
		for (var i = 0; i < 21; i++) {
			// Reference On Back Side Line
			fieldReferences.addChild( new paper.Path.Circle({
				center: fieldOffset.add( new paper.Point(8*pps*i, 0) ),
				radius: 3,
				strokeColor: 'purple',
				name: ( i < 10 ? 'back_sl_'+(5*i)+'_left' : ( i == 10 ?  'back_sl_50_center' : ( i%10 > 0 ? 'back_sl_' + ((5*i) - (10*(i%10))) + '_right' : 'back_sl_0_right' ) ) ),
				visible: false,
			}) );

			// Reference On Back Hash
			fieldReferences.addChild( new paper.Path.Circle({
				center: fieldOffset.add( new paper.Point(8*pps*i, hashDist.back*4*pps) ),
				radius: 3,
				strokeColor: 'purple',
				name: ( i < 10 ? 'back_hash_'+(5*i)+'_left' : ( i == 10 ?  'back_hash_50_center' : ( i%10 > 0 ? 'back_hash_' + ((5*i) - (10*(i%10))) + '_right' : 'back_hash_0_right' ) ) ),
				visible: false,
			}) );

			// Reference On Front Hash
			fieldReferences.addChild( new paper.Path.Circle({
				center: fieldOffset.add( new paper.Point(8*pps*i, hashDist.front*4*pps) ),
				radius: 3,
				strokeColor: 'purple',
				name: ( i < 10 ? 'front_hash_'+(5*i)+'_left' : ( i == 10 ?  'front_hash_50_center' : ( i%10 > 0 ? 'front_hash_' + ((5*i) - (10*(i%10))) + '_right' : 'front_hash_0_right' ) ) ),
				visible: false,
			}) );

			// Reference On Front Side Line
			fieldReferences.addChild( new paper.Path.Circle({
				center: fieldOffset.add( new paper.Point(8*pps*i, 84*pps) ),
				radius: 3,
				strokeColor: 'purple',
				name: ( i < 10 ? 'front_sl_'+(5*i)+'_left' : ( i == 10 ?  'front_sl_50_center' : ( i%10 > 0 ? 'front_sl_' + ((5*i) - (10*(i%10))) + '_right' : 'front_sl_0_right' ) ) ),
				visible: false,
			}) );

		}

		return rtnLayer;
	}

	static drawPoint(x, y, symbol) {
		var tmp = new paper.PointText({
			point: [x, y],
			content: symbol,
			fillColor: 'black',
			fontFamily: 'Arial'
		});
		// This centers the PointText on the specified point
		tmp.position = [x, y];
		return tmp;
	}

	static toggle(object) {
		if (object.visible != undefined) {
			object.visible = !object.visible;
			return true;
		}
		return -1;

	}

	static initPanZoom(canvasId) {
		var canvasHeight = $('#'+canvasId)[0].height;
		var canvasWidth = $('#'+canvasId)[0].width;

		$('#'+canvasId).mousewheel(function(event) {
			if (event.shiftKey) {
				view.center = PanZoom.changeCenter(
					view.center,
					event.deltaX,
					event.deltaY,
					event.deltaFactor,
					-canvasWidth/15,	// xMin
					canvasWidth, 	// xMax
					-canvasHeight/15, 	// yMin
					canvasHeight	// yMax
				);
				event.preventDefault()
			} else if (event.altKey) {
				// ZOOM
				var oldZoom = view.zoom;
				var mousePosition = new paper.Point(event.offsetX, event.offsetY);
				var [newZoom, offset] = PanZoom.changeZoom(oldZoom, event.deltaY, view.center, mousePosition, 1.05, 4, 0.25);
				view.zoom = newZoom;
				view.center = view.center.add(offset);
			}
		});
	}

	static resetPanZoom() {
		view.zoom = 1;
		view.center = [view.size.width/2, view.size.height/2];
	}

	static getFnSet(desiredFeature, obj) {
		if (obj === undefined) {
			obj = {};
		}
		if (obj.layerToUse === undefined) {
			// check to see if the drawing layer exist
			var layer = project.getItem({className: 'Layer', name: 'drawings'});
			if (!layer) {
				layer = new paper.Layer({name: 'drawings'});
			}
		}
		var rtnVal = {
			onMouseDown: null,
			onMouseDrag: null,
			onMouseUp: null
		}
		// Any path drawing will use this. It will automatically go to the activeLayer.
		var path;

		if (desiredFeature === "drawPath") {
			rtnVal.onMouseDown = function(event) {
				// If we produced a path before, deselect it:
				if (path) {
					path.selected = false;
				}

				// Create a new path and set its stroke color to black:
				path = new paper.Path({
					segments: [event.point],
					strokeColor: 'black',
					parent: layer
				});
			}

			rtnVal.onMouseDrag = function(event) {
				path.add(event.point);
			}

			rtnVal.onMouseUp = function(event) {
				// When the mouse is released, simplify it:
				path.simplify(10);

				// Let's also populate w/ some points because why not.
				var numPoints = Math.ceil(Math.floor(path.length/10)/2);
				for (var i = 0; i <= numPoints; i++) {
					var offset = path.length / numPoints;
					var point = path.getPointAt(offset * i);
					Helpers.drawPoint(point.x, point.y, 'X');
				}
			}
		}

		return rtnVal;
	}

	static getNextPosition(point, direction, offset, stepSize, pps) {
		if (direction == undefined) {
			direction = Helpers.MOVE.MT;
		}
		if (offset == undefined) {
			offset = 1;
		}
		if (stepSize == undefined) {
			stepSize = Helpers.STEP.STND;
		}
		if (pps == undefined) {
			pps = 5;
		}

		var rtnVal;
		if (direction == Helpers.MOVE.FM) {
			if (stepSize === Helpers.STEP.STND) {
				rtnVal = [point.x, point.y + (offset * pps)];
			} else if (stepSize === Helpers.STEP.HALF) {
				// 16-5 is half a regular step.
				rtnVal = [point.x, point.y + ((offset * pps)/2)];
			}
		} else if (direction === Helpers.MOVE.BM) {
			if (stepSize === Helpers.STEP.STND) {
				rtnVal = [point.x, point.y - (offset * pps)];
			} else if (stepSize === Helpers.STEP.HALF) {
				// 16-5 is half a regular step.
				rtnVal = [point.x, point.y - ((offset * pps)/2)];
			}
		} else if (direction === Helpers.MOVE.LT) {
			if (stepSize === Helpers.STEP.STND) {
				rtnVal = [point.x + (offset * pps), point.y];
			} else if (stepSize === Helpers.STEP.HALF) {
				// 16-5 is half a regular step.
				rtnVal = [point.x + ((offset * pps)/2), point.y ];
			}
		} else if (direction === Helpers.MOVE.RT) {
			if (stepSize === Helpers.STEP.STND) {
				rtnVal = [point.x - (offset * pps), point.y];
			} else if (stepSize === Helpers.STEP.HALF) {
				// 16-5 is half a regular step.
				rtnVal = [point.x - ((offset * pps)/2), point.y ];
			}
		} else if (direction === Helpers.MOVE.MT) {
			rtnVal = [point.x, point.y];
		} else if (direction === Helpers.OBLIQUE.FL) {
			// FL = Towards South East corner (+x, +y)
			rtnVal = [point.x + (offset * pps), point.y + (offset * pps)];
		} else if (direction === Helpers.OBLIQUE.FR) {
			// FR = Towards South West corner (-x, +y)
			rtnVal = [point.x - (offset * pps), point.y + (offset * pps)];
		} else if (direction === Helpers.OBLIQUE.BL) {
			// BL = Towards North East corner (+x, -y)
			rtnVal = [point.x + (offset * pps), point.y - (offset * pps)];
		} else if (direction === Helpers.OBLIQUE.BR) {
			// BR = Towards North West corner (-x, -y)
			rtnVal = [point.x - (offset * pps), point.y - (offset * pps)];
		}

		return rtnVal;

	}

	static applyMoveSet(point, moveSet) {
		/* moveSet = {
		 *		move: Helpers.MOVE.<value>,
		 *		counts: <number>,
		 *		stepSize: <number>, [optional]
		 *		pps: <number>, [optional]
		 * }
		 */
		// return an array of points
		var rtnVal = [];

		for (var count = 1; count <= moveSet.counts; count++) {
			rtnVal.push(Helpers.getNextPosition(point, moveSet.move, count));
		}

		return rtnVal;
	}

	static applyMoveSetArray(point, moveSet) {
		/* moveSet = {
		 *		move: Helpers.MOVE.<value>,
		 *		counts: <number>,
		 *		stepSize: <number>, [optional]
		 *		pps: <number>, [optional]
		 * }
		 */
		// return an array of points
		var rtnVal = [];
		var newPoint = point;

		for (var set = 0; set < moveSet.length; set++) {
			// for each set, apply it to the point
			rtnVal = rtnVal.concat( Helpers.applyMoveSet(newPoint, moveSet[set]) );
			// we need to set the starting point to be the last position in the rtnVal.
			// it also needs to be a Point object
			newPoint = new paper.Point(rtnVal[rtnVal.length-1]);
		}

		return rtnVal;
	}

	static applyPatternSet(point, patternSet) {
		/* 
		 *	patternSet = {
		 *		counts: 16,
		 *		pattern: [						// 	And array of moveSets
		 *			{
		 *				move: Helpers.MOVE.FM,
		 *				counts: 2
		 *			},
		 *			{
		 *				move: Helpers.MOVE.MT,
		 *				counts: 2
		 *			},
		 *		],
		 *		reference: <Point Object>, 		// 	This the point that will be checked against to see if we stop 
		 * 											the patten and move on to the remaining moveSet.
		 * 											The full Pattern will be completed before checking agains the reference
		 *		dimension: {					// 	which dimensions should be compare the reference against? (it can be both)
		 *			x: false,
		 *			y: true
		 *		},
		 *		moveSet: {						// 	This is the move set that is applied for the remaining counts
	 	 *			move: Helpers.MOVE.FM,
		 *			counts: 4 // this should be over-written based on how many counts are remaining after running the patternSet through hitting the reference
		 *		},
		 *	}
		 */
		// return an array of points
		var rtnVal = [];
		var newPoint = point;
		var remainingCounts = patternSet.counts;
		var patternCounts = 0;
		var hitReference = false;
		var buildRef = {x: null, y: null};
		// now check against the reference
		buildRef = new Point({
			x: ( patternSet.dimension.x ? newPoint.x : patternSet.reference.x ),
			y: ( patternSet.dimension.y ? newPoint.y : patternSet.reference.y )
		});

		for (var i = 0; i < patternSet.pattern.length; i++) {
			patternCounts += patternSet.pattern[i].counts;
		}

		// Do a pre-check to see if we happen to start on the reference point
		if (buildRef.subtract(patternSet.reference).length == 0) {
			hitReference = true;
		} 

		// If we haven't met the reference poinst AND we have enough counts for 1 more round through the pattern
		// patternCounts > 0 is there to help prevent an infinit loop
		while (!hitReference && remainingCounts >= patternCounts && patternCounts > 0) {
			// apply the pattern
			rtnVal = rtnVal.concat( Helpers.applyMoveSetArray(newPoint, patternSet.pattern) );
			// reduce the remainingCounts
			remainingCounts -= patternCounts;
			// we need to set the starting point to be the last position in the rtnVal.
			// it also needs to be a Point object
			newPoint = new paper.Point(rtnVal[rtnVal.length-1]);

			// now check against the reference
			buildRef.x = ( patternSet.dimension.x ? newPoint.x : patternSet.reference.x );
			buildRef.y = ( patternSet.dimension.y ? newPoint.y : patternSet.reference.y);
			// the vector length of the difference betten this built Ref. point and the desired ref point
			if (buildRef.subtract(patternSet.reference).length == 0) {
				hitReference = true;
			}
		}

		// There is a chance we never met the reference point, but still have remainingCounts if the pattern
		// has more counts than there are remaining.
		// IMPORTANT: This method assumes a full run through the pattern before finishing remaining.
		// I should figure out a nice way to handle this situation, but I will assume Future Me can do Math correctly
		// when building the patternSet.pattern
		if (hitReference) {
			// finish remaining counts using the patternSet.moveSet
			patternSet.moveSet.counts = remainingCounts;
			rtnVal = rtnVal.concat( Helpers.applyMoveSet(newPoint, patternSet.moveSet) );
		} else {
			// we ran out available counts to run a full Pattern, but we never found the reference point
		}


		return rtnVal;
	}

	static applyPatternSetV2(point, patternSet) {
		/* 
		 *	patternSet = {
		 *		counts: 16,
		 *		pattern: [						// 	And array of Patterns (which themselves are arrays of moveSets)
		 *			[
		 *				{
		 *					move: Helpers.MOVE.FM,
		 *					counts: 2
		 *				},
		 *				{
		 *					move: Helpers.MOVE.MT,
		 *					counts: 2
		 *				},
		 *			],
		 *		],
		 *		reference: { 			// The reference is now a struct / point & dimension
					point: <Point Object>, 		// 	This the point that will be checked against to see if we stop 
		 * 											the patten and move on to the remaining moveSet.
		 * 											The full Pattern will be completed before checking agains the reference
		 *			dimension: {					// 	which dimensions should be compare the reference against? (it can be both)
		 *				x: false,
		 *				y: true
		 *			},
		 *		},
		 *		moveSet: {						// 	This is the final move set that is applied for the remaining counts after all patterns are completed.
	 	 *			move: Helpers.MOVE.FM,
		 *			counts: 4 // this should be over-written based on how many counts are remaining after running the patternSet through hitting the reference
		 *		},
		 *	}
		 */
		// return an array of points
		var rtnVal = [];
		var newPoint = point;
		var remainingCounts = patternSet.counts;
		// var patternCounts = 0;
		// var hitReference = false;
		var buildRef = {x: null, y: null};
		// let's start by checking if we began on the first reference point
		// now check against the reference
		buildRef = new Point({
			x: ( patternSet.reference[0].dimension.x ? newPoint.x : patternSet.reference[0].point.x ),
			y: ( patternSet.reference[0].dimension.y ? newPoint.y : patternSet.reference[0].point.y )
		});

		// Loop throught each pattern
		for (var patternIdx = 0; patternIdx < patternSet.pattern.length; patternIdx++) {
			var ptrn = patternSet.pattern[patternIdx];
			var patternCounts = 0;
			var hitReference = false;

			// how many counts are in this pattern?
			for (var mvSetIdx = 0; mvSetIdx < ptrn.length; mvSetIdx++) {
				patternCounts += ptrn[mvSetIdx].counts;
			}

			// Do a pre-check to see if we happen to start on the reference point & we are on the first pattern
			// only check on the first pattern because it is a pre-check after all
			if (patternIdx == 0 && buildRef.subtract(patternSet.reference[patternIdx].point).length == 0) {
				hitReference = true;
			}

			// If we haven't met the reference poinst AND we have enough counts for 1 more round through the pattern
			// patternCounts > 0 is there to help prevent an infinit loop
			while (!hitReference && remainingCounts >= patternCounts && patternCounts > 0) {
				// apply the pattern
				rtnVal = rtnVal.concat( Helpers.applyMoveSetArray(newPoint, ptrn) );
				// reduce the remainingCounts
				remainingCounts -= patternCounts;
				// we need to set the starting point to be the last position in the rtnVal.
				// it also needs to be a Point object
				newPoint = new paper.Point(rtnVal[rtnVal.length-1]);

				// now check against the reference
				buildRef.x = ( patternSet.reference[patternIdx].dimension.x ? newPoint.x : patternSet.reference[patternIdx].point.x );
				buildRef.y = ( patternSet.reference[patternIdx].dimension.y ? newPoint.y : patternSet.reference[patternIdx].point.y);
				// the vector length of the difference betten this built Ref. point and the desired ref point
				if (buildRef.subtract(patternSet.reference[patternIdx].point).length == 0) {
					hitReference = true;
				}
			}

			// There is a chance we never met the reference point, but still have remainingCounts if the pattern
			// has more counts than there are remaining.
			// IMPORTANT: This method assumes a full run through the pattern before finishing remaining.
			// I should figure out a nice way to handle this situation, but I will assume Future Me can do Math correctly
			// when building the patternSet.pattern
			if (hitReference) {
				// if we hit the reference, then it is time to move to the next pattern. So do nothing
			} else {
				// we ran out available counts to run a full Pattern, but we never found the reference point
				console.log("[ Error: Not enough counts remaining to apply the full pattern. Remaining: "+remainingCounts+". Counts in full pattern: "+patternCounts+" ]");
				// try to complete as much of this pattern as possible??
			}

			// ==============================================
			// We have finished looping through the pattern,
			// because we have met one of two conditions:
			// 		1. We hit the reference point
			//		2. we ran out of available counts
			// ==============================================

		}

		// finish remaining counts using the final moveSet
		patternSet.moveSet.counts = remainingCounts;
		rtnVal = rtnVal.concat( Helpers.applyMoveSet(newPoint, patternSet.moveSet) );

		return rtnVal;
	}

	// Version 3 of ApplyPatternSet is another restructure that handles multiple patterns, but allows for specifying if we care about a reference line for a pattern if a reference for a pattern is undefined or null, then apply the pattern 1 time and 1 time only.
	static applyPatternSetV3(point, patternSet) {
		// See SampleStructures.js for what patternSet should look like.
		// return an array of points
		var rtnVal = [];
		var newPoint = point;
		var remainingCounts = patternSet.counts;
		var buildRef = new Point([0,0]);
		

		// Loop throught each pattern
		for (var patternIdx = 0; patternIdx < patternSet.patterns.length; patternIdx++) {
			var ptrnObj = patternSet.patterns[patternIdx];
			var patternCounts = 0;
			var hitReference = false;
			var useReference = ((ptrnObj.reference !== undefined && ptrnObj.reference !== null) ? true : false);


			// how many counts are in this pattern?
			for (var mvSetIdx = 0; mvSetIdx < ptrnObj.pattern.length; mvSetIdx++) {
				patternCounts += ptrnObj.pattern[mvSetIdx].counts;
			}

			// Do we use a reference for this pattern? If so, it's business as usual
			if (useReference) {

				// Do a pre-check to see if we happen to start on the reference point
				buildRef.x = ( ptrnObj.reference.dimension.x ? newPoint.x : ptrnObj.reference.point.x );
				buildRef.y = ( ptrnObj.reference.dimension.y ? newPoint.y : ptrnObj.reference.point.y);
				if (/*patternIdx == 0 &&*/ buildRef.subtract(ptrnObj.reference.point).length == 0) {
					hitReference = true;
				}

				// If we haven't met the reference poinst AND we have enough counts for 1 more round through the pattern
				// patternCounts > 0 is there to help prevent an infinit loop
				while (!hitReference && remainingCounts >= patternCounts && patternCounts > 0) {
					// apply the pattern
					rtnVal = rtnVal.concat( Helpers.applyMoveSetArray(newPoint, ptrnObj.pattern) );
					// reduce the remainingCounts
					remainingCounts -= patternCounts;
					// we need to set the starting point to be the last position in the rtnVal.
					// it also needs to be a Point object
					newPoint = new paper.Point(rtnVal[rtnVal.length-1]);

					// now check against the reference
					buildRef.x = ( ptrnObj.reference.dimension.x ? newPoint.x : ptrnObj.reference.point.x );
					buildRef.y = ( ptrnObj.reference.dimension.y ? newPoint.y : ptrnObj.reference.point.y);
					// the vector length of the difference betten this built Ref. point and the desired ref point
					if (buildRef.subtract(ptrnObj.reference.point).length == 0) {
						hitReference = true;
					}
				}

				// There is a chance we never met the reference point, but still have remainingCounts if the pattern
				// has more counts than there are remaining.
				// IMPORTANT: This method assumes a full run through the pattern before finishing remaining.
				// I should figure out a nice way to handle this situation, but I will assume Future Me can do Math correctly
				// when building the patternSet.pattern
				if (hitReference) {
					// if we hit the reference, then it is time to move to the next pattern. So do nothing
				} else {
					// we ran out available counts to run a full Pattern, but we never found the reference point
					console.log("[ Error: Not enough counts remaining to apply the full pattern. Remaining: "+remainingCounts+". Counts in full pattern: "+patternCounts+" ]");
					// try to complete as much of this pattern as possible??
				}

				// ==============================================
				// We have finished looping through the pattern,
				// because we have met one of two conditions:
				// 		1. We hit the reference point
				//		2. we ran out of available counts
				// ==============================================

			} else {
				// This is when we do NOT use a reference for a pattern. In this case apply the pattern 1 time and 1 time only

				if (remainingCounts >= patternCounts && patternCounts > 0) {
					// apply the pattern
					rtnVal = rtnVal.concat( Helpers.applyMoveSetArray(newPoint, ptrnObj.pattern) );
					// reduce the remainingCounts
					remainingCounts -= patternCounts;
					// we need to set the starting point to be the last position in the rtnVal.
					// it also needs to be a Point object
					newPoint = new paper.Point(rtnVal[rtnVal.length-1]);
				} else {
					// we ran out available counts to run a full Pattern
					console.log("[ Error: Not enough counts remaining to apply the full pattern. Remaining: "+remainingCounts+". Counts in full pattern: "+patternCounts+" ]");
					// try to complete as much of this pattern as possible??
				}

			}

		}

		// finish remaining counts using the final moveSet
		patternSet.moveSet.counts = remainingCounts;
		rtnVal = rtnVal.concat( Helpers.applyMoveSet(newPoint, patternSet.moveSet) );

		return rtnVal;
	}

	static follow(leader, followerCurrent, counts, replaceEvery) {
		// followerCurrent is a [x, y]
		var startingIdx = leader.length-1-counts;
		// leader is [ [x,y] ] (A positionSet for the leader)
		var ftlPositions = leader.slice(startingIdx, startingIdx+counts);
		var prefixPositions = [];
		// we do not need to get the very last position (only get replaceEvery-1) because that position will be added by the leader.slice() return;
		for (var i=1; i<replaceEvery; i++) {
			var currentStartingPoint = new Point(followerCurrent);
			var vector = new Point(ftlPositions[0]).subtract( currentStartingPoint );
			var nextPoint = currentStartingPoint.add( (vector.divide(replaceEvery).multiply(i)) );
			prefixPositions.push( [nextPoint.x, nextPoint.y] );
		}
		prefixPositions = prefixPositions.concat(ftlPositions);
		return prefixPositions.slice(0, counts);

	}

}