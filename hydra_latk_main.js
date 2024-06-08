/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
licensed with CC BY-NC-SA 4.0 https://creativecommons.org/licenses/by-nc-sa/4.0
Nick Fox-Gieg  /  @n1ckfg  /  fox-gieg.com















































 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

await loadScript("https://unpkg.com/latk@1.0.3/latk.js")
p = new P5({mode: 'WEBGL'}) // loads p5js library, comment this line after using it once
p.hide() // hide p5js canvas.

currentFrame = 0
currentLayer = 0
lastFrameOfAll = 0
marktime = 0
fps = (1.0 / 12.0) * 1000.0
latk = new Latk(init = true)
isPlaying = false
clicked = false
tempStroke = new LatkStroke()
mainColor = p.color(255, 192)
newColor = p.color(255, 127, 0, 255)

p.noFill()

function setLastFrameOfAll() {
	lastFrameOfAll = 0;
	for (let layer of latk.layers) {
		if (layer.frames.length - 1 > lastFrameOfAll) {
			lastFrameOfAll = layer.frames.length - 1
		}
	}
}

function initLatk() {
	latk = new Latk(init = true)
	currentFrame = 0
	currentLayer = 0
	setLastFrameOfAll()
}

initLatk()

function deleteFromLatk() {
	if (latk.layers[currentLayer].frames[currentFrame].strokes.length === 1) {
		latk.layers[currentLayer].frames[currentFrame].strokes[0].points = []
	} else {
		latk.layers[currentLayer].frames[currentFrame].strokes.splice(latk.layers[currentLayer].frames[currentFrame].strokes.length - 1, 1)
	}

	if (latk.layers[currentLayer].frames[currentFrame].strokes.length < 1 && latk.layers[currentLayer].frames.length > 1) {
		latk.layers[currentLayer].frames.splice(currentFrame, 1)
		changeFrame(-1)
	}
}

function changeFrame(diff) {
	currentFrame += diff
	if (currentFrame > latk.layers[currentLayer].frames.length - 1) {
		currentFrame = 0
	} else if (currentFrame < 0) {
		currentFrame = latk.layers[currentLayer].frames.length - 1
	}
}

p.mousePressed = () => {
	clicked = true
}

p.mouseReleased = () => {
	clicked = false
	latk.layers[currentLayer].frames[currentFrame].strokes.push(tempStroke)
	tempStroke = new LatkStroke()
}

p.keyPressed = () => {
	if (latk.ready) {
		console.log(p.key)
		switch (p.key) {
			case "a":
				initLatk()
				break
			case "p":
				isPlaying = !isPlaying
				break
			case "f":
				latk.layers[currentLayer].frames.push(new LatkFrame(latk.layers[currentLayer].frames.length))
				currentFrame = latk.layers[currentLayer].frames.length - 1
				setLastFrameOfAll()
				break
			case "z":
				deleteFromLatk()
				break
			case "ArrowUp":
				changeLayer(1)
				break
			case "ArrowDown":
				changeLayer(-1)
				break
			case "ArrowLeft":
				changeFrame(-1)
				break
			case "ArrowRight":
				changeFrame(1)
				break
		}
	}
}

p.draw = () => {
	p.background(0)

	if (latk.ready) {
		p.strokeWeight(5)
		p.stroke(mainColor)
		for (let layer of latk.layers) {
			for (let strokeObj of layer.frames[currentFrame].strokes) {
				p.beginShape()
				for (let point of strokeObj.points) {
					x = point.co[0] - p.width/2
					y = point.co[1] - p.height/2
					p.vertex(x, y)
				}
				p.endShape()
			}
			
			if (layer.frames.length > lastFrameOfAll) lastFrameOfAll = layer.frames.length
		}

		t = p.millis()
		if (isPlaying && t > marktime + fps) {
			currentFrame++
			if (currentFrame > lastFrameOfAll-1) currentFrame = 0 % lastFrameOfAll
			marktime = t
		}
	}

	if (p.mouseIsPressed) {
		tempStroke.points.push(new LatkPoint([p.mouseX, p.mouseY, 0]))
	}

	p.strokeWeight(5)
	p.stroke(newColor)
	p.beginShape()
	for (let point of tempStroke.points) {
		x = point.co[0] - p.width/2
		y = point.co[1] - p.height/2
		p.vertex(x, y)
	}
	p.endShape()
}

s0.init({
	src: p.canvas
})

src(s0)
	.out()
