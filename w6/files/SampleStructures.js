// APPLYPATTERNSETV3 STRUCTURE
// var patternSet = {
// 	counts: 128,
// 	patterns: [
// 		{	// PATTERN 1: START BY MT 2
// 			pattern: [
// 				{
// 					move: Helpers.MOVE.MT,
// 					counts: 2
// 				},
// 			],
// 			reference: null,
// 		},
// 		{	// PATTERN 2: Approach Goal Line F2M2
// 			pattern: [
// 				{
// 					move: Helpers.MOVE.RT,
// 					counts: 2
// 				},
// 				{
// 					move: Helpers.MOVE.MT,
// 					counts: 2
// 				},
// 			],
// 			reference: {
// 				point: <Point Object>, // REFERENCE 2: right Goal Line
// 				dimension: {
// 					x: true,
// 					y: false
// 				},
// 			},
// 		},
// 		{	// PATTERN 3: OBLIQUE UNTIL WE HIT SIDELINE OR RUN OUT OF COUNTS
// 			pattern: [
// 				{
// 					move: Helpers.OBLIQUE.FR,
// 					counts: 1 // This pattern is 1 count, because we could hit the SideLine on any count.
// 				},
// 			],
// 			reference: {
// 				point: project.getItem({name: 'front_side_line'}).position, // REFERENCE 3: Front Side Line
// 				dimension: {
// 					x: false,
// 					y: true
// 				},
// 			},
// 		},
// 		{	// PATTERN 4: AFTER HITTING FRONT SIDELINE MT2
// 			pattern: [
// 				{
// 					move: Helpers.MOVE.MT,
// 					counts: 2
// 				},
// 			],
// 			reference: {
// 				point: <Point Object>, // REFERENCE 4: Front Side Line
// 				dimension: {
// 					x: false,
// 					y: true
// 				},
// 			}
// 		}
// 	],
//
// 	moveSet: { // After hitting front sideline, oblique in other directions
// 		move: Helpers.OBLIQUE.BR,
// 		counts: 4 // this should be over-written based on how many counts are remaining after running the patternSet through hitting the reference
// 	},
// }


