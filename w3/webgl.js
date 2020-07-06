// create Shader of specified type, upload the source, and compile it
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// send the source to the shader object
	gl.shaderSource(shader, source);

	// compile the shader
	gl.compileShader(shader);

	// did it compile successfully? if not, "throw" an error
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

// Initialize a shader program, so WebGL knows how to draw the data
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Now that the shaders are compiled, create the Shader Program and attach the shaders to the program
	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	// Once the shaders are attached to the program, link the program to the WebGL Object
	gl.linkProgram(shaderProgram);

	// if creating the Shader Program failed, "throw" an error
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;

}

// Initialize the buffers
function initBuffers(gl) {
	// Create a buffer for the square's positions.
	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here on out.
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// create an array of positions for the square.
	const positions = [
		// Square
		-1.0,  1.0,
		1.0,  1.0,
		-1.0, -1.0,
		1.0, -1.0,
		// Triangle
		-10.0, -1.0,
		-8.0, -1.0,
		-9.0, 1.0,
	];

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
	};
}

function drawScene(gl, programInfo, buffers) {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 90 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.

	const fieldOfView = 90 * Math.PI / 180;   // in radians
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	const projectionMatrix = mat4.create();

	// note: glmatrix.js always has the first argument as the destination to receive the result.
	mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

	// Set the drawing position to the "identity" point, which is the center of the scene.
	const modelViewMatrix = mat4.create();

	// Now move the drawing position a bit to where we want to start drawing the square.
	mat4.translate(modelViewMatrix,     // destination matrix
		modelViewMatrix,     // matrix to translate
		[-0.0, 0.0, -6.0]);  // amount to translate [x, y, z] --> move the model away from the camera. If it were 0, then the model would be on top of the camera

	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute.
	{
		const numComponents = 2;	// pull out 2 values per iteration
		const type = gl.FLOAT;		// the data in the buffer is 32bit floats
		const normalize = false;	// don't normalize
		const stride = 0;			// how many bytes to get from one set of values to the next
									// 0 = use type and numComponents above
		const offset = 0;			// how many bytes inside the buffer to start from
		gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
		gl.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
	}

	// Tell WebGL to use our program when drawing
	gl.useProgram(programInfo.program);

	// Set the shader uniforms
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.projectionMatrix,
		false,
		projectionMatrix
	);
	gl.uniformMatrix4fv(
		programInfo.uniformLocations.modelViewMatrix,
		false,
		modelViewMatrix
	);

	// Draw the square: (the first 4 vertecies)
	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}

	{
		const offset = 4;
		const vertexCount = 3;
		gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	}
}


// We all love a good main()... right? Call this on the HTML page
function main() {
	const canvas = document.getElementById('example');
	const gl = canvas.getContext('webgl');

	// Is WebGL available in the browser?
	if (gl === null) {
		alert ("WebGL could not be initialized. The browser might not support it.");
		return;
	}

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Vertex Shader Program
	const vsSource = `
		attribute vec4 aVertexPosition;

		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		void main() {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		}
	`;

	// Fragment Shader Program
	const fsSource = `
		void main() {
			// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			gl_FragColor = vec4(0.05, 0.40, 0.64, 1.0);
		}
	`;

	// Initialize a shader program; this is where all the lighting
	// for the vertices and so forth is established.
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		},
	};

	// Here's where we call the routine that builds all the objects we'll be drawing.
	const buffers = initBuffers(gl);

	// Draw the scene
	drawScene(gl, programInfo, buffers);
}