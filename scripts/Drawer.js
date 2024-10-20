export class Drawer
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
