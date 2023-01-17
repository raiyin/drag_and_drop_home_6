import { createRandomColor } from './utils/utils.js';

let lastDraggableNodeId = 0;
let creator = document.getElementById('creator');
let lastDroppable = null;
let portable = null;

function genDraggableNodeId() {
    lastDraggableNodeId++;
    return 'drag_' + lastDraggableNodeId;
}

function createDraggableNode() {
    let node = document.createElement('div');
    node.id = genDraggableNodeId();
    node.classList += "portable";
    node.setAttribute("draggable", "true");
    node.style.backgroundColor = createRandomColor();
    node.addEventListener('pointerdown', pointerdown);
    node.ondragstart = () => false;
    return node;
}

function setMovingStyle(element) {
    element.style.boxShadow = '5px 5px 5px grey';
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
}

function removeMovingStyle(element, ordered) {
    element.setAttribute("draggable", "false");
    element.style.boxShadow = '';
    element.style.cursor = 'default';
    element.onpointerup = null;
    element.style.position = ordered ? 'static' : 'absolute';
}

function enterDroppable(element) {
    element.style.cursor = 'copy';
}

function leaveDroppable(element) {
    element.style.cursor = 'move';
}

function setChaosCoords(element, event) {
    element.style.left = parseInt(element.style.left, 10) - event.target.offsetParent.offsetLeft + 'px';
    element.style.top = parseInt(element.style.top, 10) - event.target.offsetParent.offsetTop + 'px';
}

function determineCurrentDroppable(ev) {
    let elementBelow;
    try {
        ev.target.hidden = true;
        elementBelow = document.elementFromPoint(ev.clientX, ev.clientY);
        ev.target.hidden = false;
    }
    catch (e) { return; }

    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest('.droppable');

    if (droppableBelow != lastDroppable) {
        if (lastDroppable) leaveDroppable(ev.target);
        lastDroppable = droppableBelow;
        if (lastDroppable) enterDroppable(ev.target);
    }
}

function pointerdown(event) {
    event.preventDefault();
    let shiftX = event.clientX - this.getBoundingClientRect().left;
    let shiftY = event.clientY - this.getBoundingClientRect().top;

    setMovingStyle(this);
    document.body.append(this);
    moveAt(this, event.pageX, event.pageY);
    determineCurrentDroppable(event);

    function moveAt(element, pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function pointermove(event) {
        event.preventDefault();
        moveAt(portable, event.pageX, event.pageY);
        determineCurrentDroppable(event);
    }

    function pointerup(event) {
        document.removeEventListener('pointermove', pointermove);
        this.removeEventListener('pointerdown', pointerdown);
        if (lastDroppable) {
            let ordered = lastDroppable.classList.contains('destination-ordered');
            lastDroppable.appendChild(this);
            removeMovingStyle(this, ordered);
            if (!ordered) setChaosCoords(this, event);
        }
        else this.remove();
        portable = createDraggableNode();
        creator.appendChild(portable);
    }

    this.addEventListener('pointerup', pointerup);
    document.addEventListener('pointermove', pointermove);
}

portable = createDraggableNode();
creator.appendChild(portable);
