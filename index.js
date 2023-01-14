let lastDraggElementId = 0;
let creator = document.getElementById('creator');
let target_ordered = document.getElementById('target_ordered');
let target_chaos = document.getElementById('target_chaos');
let x = 0;
let y = 0;

function createRandomColor() {
    let colorInt = Math.floor(Math.random() * 16777215);
    let colorString = ('000000' + colorInt.toString(16)).slice(-6);
    return '#' + colorString;
}

function generateId() {
    return 'drag_' + lastDraggElementId;
}

function createNode() {
    lastDraggElementId++;
    let portable = document.createElement('div');
    portable.classList += "portable";
    portable.id = generateId();
    portable.setAttribute("draggable", "true");
    portable.style.backgroundColor = createRandomColor();
    portable.addEventListener("dragstart", dragstart_handler);
    return portable;
}

function setChaosNodePosition(element, x, y) {
    element.style.position = 'absolute';
    element.style.top = y + 'px';
    element.style.left = x + 'px';
}

function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/html", ev.target.id);
    ev.dataTransfer.setData("offsetX", ev.offsetX);
    ev.dataTransfer.setData("offsetY", ev.offsetY);
    this.style.boxShadow = '5px 5px 5px grey';
    return false;
}

function mousemove_handler(ev) {
    x = ev.offsetX;
    y = ev.offsetY;
    console.log(`${x} ${y}`);
}

function removeDragProps(element) {
    element.removeEventListener("dragstart", dragstart_handler);
    element.setAttribute("draggable", "false");
    element.style.cursor = 'default';
    element.style.boxShadow = '';
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
    creator.appendChild(createNode());
    removeDragProps(portableNode);
}

function drop_handler_chaos(ev) {
    //target_chaos.removeEventListener('mouseover', mousemove_handler);
    ev.preventDefault();
    let dragOffsetX = ev.dataTransfer.getData("offsetX");
    let dragOffsetY = ev.dataTransfer.getData("offsetY");
    const data = ev.dataTransfer.getData("text/html");
    let portableNode = document.getElementById(data);
    setChaosNodePosition(portableNode, x - dragOffsetX, y - dragOffsetY);
    ev.currentTarget.appendChild(portableNode);
    creator.appendChild(createNode());
    removeDragProps(portableNode);
}

target_ordered.addEventListener("drop", drop_handler_ordered, true);
target_ordered.addEventListener("dragover", dragover_handler);
target_chaos.addEventListener('drop', drop_handler_chaos);
target_chaos.addEventListener('dragover', dragover_handler);
target_chaos.addEventListener('mousemove', mousemove_handler);

window.addEventListener("DOMContentLoaded", () => {
    const element = document.getElementById(generateId());
    element.addEventListener("dragstart", dragstart_handler);
});
creator.appendChild(createNode());
