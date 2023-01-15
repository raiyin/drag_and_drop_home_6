import { createRandomColor } from './utils/utils.js';

let lastDraggableNodeId = 0;
let creator = document.getElementById('creator');
let target_ordered = document.getElementById('target_ordered');
let target_chaos = document.getElementById('target_chaos');

function genDraggableNodeId() {
    lastDraggableNodeId++;
    return 'drag_' + lastDraggableNodeId;
}

function createDraggableNode() {
    let portable = document.createElement('div');
    portable.id = genDraggableNodeId();
    portable.classList += "portable";
    portable.setAttribute("draggable", "true");
    portable.style.backgroundColor = createRandomColor();
    portable.addEventListener("dragstart", dragstart_handler);
    return portable;
}

function computeChaosPosition(ev) {
    let dragOffsetX = ev.dataTransfer.getData("offsetX");
    let dragOffsetY = ev.dataTransfer.getData("offsetY");
    let coordX = ev.layerX - dragOffsetX;
    let coordY = ev.layerY - dragOffsetY;
    if (ev.target.className === 'portable') {
        // Если кидаем на дочерний.
        coordX = coordX + ev.target.offsetLeft;
        coordY = coordY + ev.target.offsetTop;
    }
    return { coordX, coordY };
}

function setChaosNodePosition(element, x, y) {
    element.style.position = 'absolute';
    element.style.top = y + 'px';
    element.style.left = x + 'px';
}

function removeDragProps(element) {
    element.removeEventListener("dragstart", dragstart_handler);
    element.setAttribute("draggable", "false");
    element.style.cursor = 'default';
    element.style.boxShadow = '';
}

function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/html", ev.target.id);
    ev.dataTransfer.setData("offsetX", ev.offsetX);
    ev.dataTransfer.setData("offsetY", ev.offsetY);
    this.style.boxShadow = '5px 5px 5px grey';
}

function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}

function drop_handler_ordered(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/html");
    let portableNode = document.getElementById(data);
    ev.currentTarget.appendChild(portableNode);
    removeDragProps(portableNode);
    creator.appendChild(createDraggableNode());
}

function drop_handler_chaos(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/html");
    let portableNode = document.getElementById(data);

    let { coordX, coordY } = computeChaosPosition(ev);
    setChaosNodePosition(portableNode, coordX, coordY);
    ev.currentTarget.appendChild(portableNode);
    removeDragProps(portableNode);
    creator.appendChild(createDraggableNode());
}

target_ordered.addEventListener("drop", drop_handler_ordered, true);
target_ordered.addEventListener("dragover", dragover_handler);
target_chaos.addEventListener('drop', drop_handler_chaos);
target_chaos.addEventListener('dragover', dragover_handler);

creator.appendChild(createDraggableNode());
