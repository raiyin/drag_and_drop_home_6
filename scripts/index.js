import { createRandomColor } from './utils/utils.js';

let lastDraggableNodeId = 0;
let creator = document.getElementById('creator');
let portable = null;
let lastDroppable = null;

function genDraggableNodeId() {
    lastDraggableNodeId++;
    return 'drag_' + lastDraggableNodeId;
}

function createDraggableNode() {
    portable = document.createElement('div');
    portable.id = genDraggableNodeId();
    portable.classList += "portable";
    portable.setAttribute("draggable", "true");
    portable.style.backgroundColor = createRandomColor();
    portable.addEventListener('pointerdown', pointerdown);
    portable.ondragstart = function () {
        return false;
    };
    return portable;
}

function pointerdown(event) {
    event.preventDefault();
    let shiftX = event.clientX - portable.getBoundingClientRect().left;
    let shiftY = event.clientY - portable.getBoundingClientRect().top;

    setMovingStyle(portable);
    document.body.append(portable);
    moveAt(portable, event.pageX, event.pageY);
    determineCurrentDroppable(event);

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

    function moveAt(element, pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function enterDroppable(element) {
        element.style.cursor = 'copy';
    }

    function leaveDroppable(element) {
        element.style.cursor = 'move';
    }

    function setChaosCoords(element, event) {
        // element.style.left = event.clientX - shiftX - event.target.offsetParent.offsetLeft + 'px';
        // element.style.top = event.clientY - shiftY - event.target.offsetParent.offsetTop + 'px';

        element.style.left = parseInt(element.style.left, 10) - event.target.offsetParent.offsetLeft + 'px';
        element.style.top = parseInt(element.style.top, 10) - event.target.offsetParent.offsetTop + 'px';
    }

    function determineCurrentDroppable(ev) {
        portable.hidden = true;
        let elementBelow = document.elementFromPoint(ev.clientX, ev.clientY);
        portable.hidden = false;

        if (!elementBelow) return;
        let droppableBelow = elementBelow.closest('.droppable');

        if (droppableBelow != lastDroppable) {
            if (lastDroppable) leaveDroppable(portable);
            lastDroppable = droppableBelow;
            if (lastDroppable) enterDroppable(portable);
        }
    }

    function pointermove(event) {
        event.preventDefault();
        moveAt(portable, event.pageX, event.pageY);
        determineCurrentDroppable(event);
    }

    portable.onpointerup = function (event) {
        document.removeEventListener('pointermove', pointermove);
        if (lastDroppable) {
            let ordered = lastDroppable.classList.contains('destination-ordered');
            lastDroppable.appendChild(this);
            removeMovingStyle(this, ordered);
            if (!ordered) setChaosCoords(this, event);
        }
        else this.remove();
        creator.appendChild(createDraggableNode());
    };

    document.addEventListener('pointermove', pointermove);
}

creator.appendChild(createDraggableNode());
