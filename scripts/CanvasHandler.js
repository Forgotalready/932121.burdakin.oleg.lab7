import { Drawer } from "./Drawer.js"
import { Element } from "./Element.js"

export class CanvasHandler
{
    constructor(canvas, drawer)
    {
        this.canvas = canvas
        this.context = canvas.getContext("2d")
        this.elements = []
        this.drawer = drawer
        this.adjustCanvas()

        this.canvas.addEventListener("dblclick", this.onCanvasDblClick.bind(this))
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
