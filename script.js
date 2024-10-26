"use strict"

class Element
{
    constructor(vertices, color)
    {
        this.vertices = vertices
        this.color = color
    }
}

class Drawer
{
    draw(element, context)
    {
        context.beginPath()
        context.moveTo(element.vertices[0].x, element.vertices[0].y)
        for (let i = 1; i < element.vertices.length; i++) {
            context.lineTo(element.vertices[i].x, element.vertices[i].y)
        }
        context.closePath()
        context.fillStyle = element.color
        context.fill()
    }
}

class CanvasHandler
{
    constructor(canvas, drawer)
    {
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.elements = []
        this.drawer = drawer
        this.adjustCanvas()
        this.prevElement = null
        this.prevElementColor = null

        this.canvas.addEventListener("dblclick", this.onCanvasDblClick.bind(this))
        this.canvas.addEventListener("click", this.onCanvasClick.bind(this))
        window.addEventListener('resize', this.adjustCanvas.bind(this));
    }

    drawElement(element)
    {
        this.elements.push(element)
        this.drawer.draw(element, this.context)
    }

    adjustCanvas() 
    {
        const ratio = window.devicePixelRatio || 1;
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        this.context.scale(ratio, ratio);
        this.redraw()
    }

    redraw() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const element of this.elements) 
        {
            this.drawer.draw(element, this.context);
        }
    }

    onCanvasDblClick(event)
    {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        for (let i = this.elements.length - 1; i >= 0; i--) 
        {
            if (this.isPointInPolygon({x, y}, this.elements[i].vertices)) 
            {
                this.elements = this.elements.filter(e => e !== this.elements[i])
                this.redraw()
                break
            }
        }
    }

    onCanvasClick(event)
    {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if(this.prevElement != null)
        {
            this.prevElement.color = this.prevElementColor
        }

        for (let i = this.elements.length - 1; i >= 0; i--) 
        {
            if (this.isPointInPolygon({x, y}, this.elements[i].vertices)) 
            {
                this.prevElement = this.elements[i]
                this.prevElementColor = this.elements[i].color
                this.elements[i].color = "yellow"
                break
            }
        }
        this.redraw()
    }

    isPointInPolygon(point, vertices) 
    {
        let inside = false;
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++)
        {
            const xi = vertices[i].x, yi = vertices[i].y;
            const xj = vertices[j].x, yj = vertices[j].y;

            const intersect = ((yi > point.y) !== (yj > point.y)) &&
                              (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 0.0000001) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
}

const canvasHandler = new CanvasHandler(document.querySelector(".canvas"), new Drawer())

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


const generatePoints = (vertexNum, startX, startY, radius) => {
    const points = []
    for (let i = 0; i < vertexNum; i++) 
    {
        points.push({
            x: startX + radius * Math.cos(i * 2 * Math.PI / vertexNum), 
            y: startY + radius * Math.sin(i * 2 * Math.PI / vertexNum)
        })
    }
    return points
}

const drawRegularPolygon = (vertexNum, color) => {
    const points = generatePoints(vertexNum, getRandomInt(50,500), getRandomInt(50,500), getRandomInt(10, 90))
    canvasHandler.drawElement(new Element(points, color))
}

const onButtonClick = (button) => {
    const amount = parseInt(document.querySelector("input").value)

    if (isNaN(amount))
    {
        console.log("Invalid input")
        return
    }

    for (let i = 0; i < amount; i++)
    {
        drawRegularPolygon(parseInt(button.dataset.vertexNum), button.dataset.polygonColor)
    }
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        onButtonClick(button)
    })
})
