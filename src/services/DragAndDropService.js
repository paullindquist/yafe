import { version } from "vue";

const DROPPABLE_NAME = 'droppable';

class DragAndDropService {
    dragElement = null;
    isDragging = false;
    shiftX = null;
    shiftY = null;
    dropTargets = [];
    currentDroppable = null;

    constructor() {
        this.handleDrag = (event) => {
            event.preventDefault();
            this.dragElement = event.target.closest('[draggable=true]');
            if (this.dragElement) {
                this.dragElement.style.zIndex = 99999;
                this.dragElement.addEventListener("dragstart", (event) => {
                    console.log('drag started')
                  });
                this.startDrag(event.clientX, event.clientY);
            }
        }
        this.handleDragCallback = this.handleDrag.bind(this)
        this.onMouseUp = () => {
            this.finishDrag();
        }
        this.onMouseUpCallback = this.onMouseUp.bind(this);
        this.onMouseMove = (event) =>  {
            this.moveAt(event.clientX, event.clientY);
            this.dragElement.hidden = true;
            let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            this.dragElement.hidden = false;
          
            if (elemBelow) {
                let droppableBelow = elemBelow.closest(`.${DROPPABLE_NAME}`);
            
                if (this.currentDroppable != droppableBelow) {
                    if (this.currentDroppable) {
                        console.log('leaving');
                    }
                    this.currentDroppable = droppableBelow;
                    if (this.currentDroppable) {
                        console.log('entering');
                    }
                }
            }
        }
        this.onMouseMoveCallback = this.onMouseMove.bind(this);
        // document.addEventListener('mousedown', this.handleDragCallback);
    }

    startDrag(clientX, clientY) {
        if (!this.isDragging) {
            this.isDragging = true;

            document.addEventListener('mouseup', this.onMouseUpCallback);
            document.addEventListener('mousemove', this.onMouseMoveCallback);

            this.shiftX = clientX - this.dragElement.getBoundingClientRect().left;
            this.shiftY = clientY - this.dragElement.getBoundingClientRect().top;

            this.dragElement.style.position = 'fixed';

            this.moveAt(clientX, clientY);
        }
    }
    finishDrag() {
        if (this.isDragging) {

            this.isDragging = false;
            this.dragElement.style.top = parseInt(this.dragElement.style.top) + window.pageYOffset + 'px';

            document.removeEventListener('mouseup', this.onMouseUpCallback);
            document.removeEventListener('mousemove',  this.onMouseMoveCallback);

            this.dragElement.ondragstart = null;
            if (this.currentDroppable) {
                console.log('made it here')
                const parentBoundingBox = this.currentDroppable.getBoundingClientRect();
                const childBoundingBox = this.dragElement.getBoundingClientRect();
                console.log(childBoundingBox);
                this.dragElement.style.top = `${(childBoundingBox.top - parentBoundingBox.top)}px`;
                this.dragElement.style.left = `${(childBoundingBox.left - parentBoundingBox.left)}px`;
                this.dragElement.parentNode.removeChild(this.dragElement);
                this.dragElement.style.position = 'absolute';
                this.currentDroppable.appendChild(this.dragElement);
                this.currentDroppable = null;
            }
        }
    }
    moveAt(clientX, clientY) {
        let newX = clientX - this.shiftX;
        let newY = clientY - this.shiftY;

        // check if the new coordinates are below the bottom window edge
        let newBottom = newY + this.dragElement.offsetHeight; // new bottom

        // below the window? let's scroll the page
        if (newBottom > document.documentElement.clientHeight) {
            // window-relative coordinate of document end
            let docBottom = document.documentElement.getBoundingClientRect().bottom;

            // scroll the document down by 10px has a problem
            // it can scroll beyond the end of the document
            // Math.min(how much left to the end, 10)
            let scrollY = Math.min(docBottom - newBottom, 10);

            // calculations are imprecise, there may be rounding errors that lead to scrolling up
            // that should be impossible, fix that here
            if (scrollY < 0) scrollY = 0;

            window.scrollBy(0, scrollY);

            // a swift mouse move make put the cursor beyond the document end
            // if that happens -
            // limit the new Y by the maximally possible (right at the bottom of the document)
            newY = Math.min(newY, document.documentElement.clientHeight - this.dragElement.offsetHeight);
        }

        // check if the new coordinates are above the top window edge (similar logic)
        if (newY < 0) {
            // scroll up
            let scrollY = Math.min(-newY, 10);
            if (scrollY < 0) scrollY = 0; // check precision errors

            window.scrollBy(0, -scrollY);
            // a swift mouse move can put the cursor beyond the document start
            newY = Math.max(newY, 0); // newY may not be below 0
        }


        // limit the new X within the window boundaries
        // there's no scroll here so it's simple
        if (newX < 0) newX = 0;
        if (newX > document.documentElement.clientWidth - this.dragElement.offsetWidth) {
            newX = document.documentElement.clientWidth - this.dragElement.offsetWidth;
        }


        this.dragElement.style.left = newX + 'px';
        this.dragElement.style.top = newY + 'px';
    }
    registerDropTarget(dropTarget) {
        dropTarget.classList.add(DROPPABLE_NAME);
    }

}
export default new DragAndDropService();

