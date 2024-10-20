"use strict"

import { CanvasHandler } from "./CanvasHandler.js"
import { Drawer } from "./Drawer.js"
import { Element } from "./Element.js"

const canvasHandler = new CanvasHandler(document.querySelector(".canvas"), new Drawer())

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const generatePoints = (vertexNum, startX, startY, radius) => {
    const points = []
    for (let i = 0; i < vertexNum; i++) 
    {
        points.push({x: startX + radius * Math.cos(i * 2 * Math.PI / vertexNum), y: startY + radius * Math.sin(i * 2 * Math.PI / vertexNum)})
    }
    return points
}

const drawRegularPolygon = (vertexNum) => {
    const points = generatePoints(vertexNum, getRandomInt(50,500), getRandomInt(50,500), 50)
    canvasHandler.drawElement(new Element(points, getRandomColor()))
}

const onButtonClick = (vertexNum) => {
    const amount = parseInt(document.querySelector("input").value)

    if (isNaN(amount))
    {
        console.log("Invalid input")
        return
    }

    for (let i = 0; i < amount; i++)
    {
        drawRegularPolygon(vertexNum)
    }
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        onButtonClick(parseInt(button.dataset.vertexNum))
    })
})
