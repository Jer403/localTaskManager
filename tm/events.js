import { getCalendarWidth } from "../../taskmanager.js";
import { convertDateToString, getLang } from "../utils.js";
import { createCalendarList } from "./creator.js";
import { appearInput, appearModBtns, checkFromBox, disappearModBtns, getActualCalendarPosition, getDaysToBackward, getDaysToForward, OnInput, setActualCalendarPosition, setDaysToBackward, setDaysToForward, setIsSaveToFalse, setValue } from "./tmUtils.js";





export function calendarForwardMove(calendarSurface, dateForward) {
    if (!(calendarSurface.scrollLeft % getCalendarWidth() == 0)) {
        return;
    }
    if (getActualCalendarPosition() == getDaysToForward()) {
        dateForward.setDate(dateForward.getDate() + 1);
        calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang()));
        setDaysToForward(getDaysToForward() + 1);
    }

    calendarSurface.scrollLeft += getCalendarWidth();
    setActualCalendarPosition(getActualCalendarPosition() + 1);
}

export function calendarBackwardMove(calendarSurface, dateBackward) {
    if (!(calendarSurface.scrollLeft % getCalendarWidth() == 0)) {
        return;
    }
    if (getActualCalendarPosition() == getDaysToBackward()) {
        dateBackward.setDate(dateBackward.getDate() - 1);
        calendarSurface.insertBefore(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang()), calendarSurface.firstChild);
        calendarSurface.classList.add("noscroll");
        calendarSurface.scrollLeft -= getCalendarWidth();
        calendarSurface.classList.remove("noscroll");
        setDaysToBackward(getDaysToBackward() - 1);
    }

    calendarSurface.scrollLeft -= getCalendarWidth();
    setActualCalendarPosition(getActualCalendarPosition() - 1);
}






export function setInputEventListener(l, txHeight, saveBtn) {


    if (l.value == '') {
        l.setAttribute("style", "height:" + txHeight + "px;overflow-y:hidden;");
    } else {
        l.setAttribute("style", "height:" + (l.scrollHeight) + "px;overflow-y:hidden;");
    }

    l.addEventListener("input", OnInput, false);

    l.addEventListener("click", (e) => {
        e.stopPropagation();
    })
    l.addEventListener("dblclick", (e) => {
        e.stopPropagation();
    })
    l.addEventListener("dragstart", (e) => {
        e.preventDefault();
        e.stopPropagation();
    })
    l.addEventListener("blur", (e) => {
        setValue(e.currentTarget);
        setIsSaveToFalse(saveBtn);

    })
    l.addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
            e.currentTarget.blur();
        }
    })
}

export function setLiEventListener(l, saveBtn) {
    l.addEventListener("dblclick", (e) => {
        appearInput(e.currentTarget.firstElementChild);
        setIsSaveToFalse(saveBtn);
    })
    l.addEventListener("click", (e) => {
        checkFromBox(e.currentTarget.firstElementChild)
        setIsSaveToFalse(saveBtn);
    })
    l.addEventListener("mouseenter", (e) => {
        Array.from(e.currentTarget.lastElementChild.lastElementChild.children).forEach(e => e.classList.remove("disappear"))
    })
    l.addEventListener("mouseleave", (e) => {
        Array.from(e.currentTarget.lastElementChild.lastElementChild.children).forEach(e => e.classList.add("disappear"))
        e.currentTarget.removeAttribute("style")
    })



}


export function dropEvent(e) {

    let parent = e.currentTarget.parentNode;
    let pos = JSON.parse(e.dataTransfer.getData("element"));

    const dropElem = e.target

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Obtener el rectángulo del elemento donde se hizo el drop
    const rect = dropElem.getBoundingClientRect();

    // Calcular el offset
    const offsetX = mouseX - rect.left;
    const offsetY = mouseY - rect.top;

    const middle = rect.height / 2;

    if (offsetY <= middle) {
        parent.insertBefore(parent.children[pos], e.currentTarget);
    } else if (offsetY > middle) {
        let elem;
        (dropElem.nameNode != "LI") ? elem = dropElem.closest("LI").nextElementSibling : elem = dropElem.nextElementSibling;
        (elem != null) ? parent.insertBefore(parent.children[pos], elem) : parent.appendChild(parent.children[pos])
    }
    setIsSaveToFalse();
    Array.from(parent.children).forEach(e => e.style = "")
}


export function dragOverEvent(e) {
    const dragElem = e.target

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Obtener el rectángulo del elemento donde se hizo el drop
    const rect = dragElem.getBoundingClientRect();

    // Calcular el offset
    const offsetX = mouseX - rect.left;
    const offsetY = mouseY - rect.top;

    const middle = rect.height / 2;

    let elem;
    (dragElem.nameNode != "LI") ? elem = dragElem.closest("LI") : elem = dragElem;

    if (offsetY <= middle) {
        elem.style = "border-top: 4px solid #fff"
    } else if (offsetY > middle) {
        elem.style = "border-bottom: 4px solid #fff"
    }
}


export function dragLeaveEvent(e) {
    const dragElem = e.currentTarget;

    let elem;
    (dragElem.nameNode != "LI") ? elem = dragElem.closest("LI") : elem = dragElem;
    elem.style = ""
}




export function showModifiButtons(element) {
    element.lastElementChild.classList.add("show")
    element.lastElementChild.classList.remove("hide")
}

export function hideModifiButtons(element) {
    element.lastElementChild.classList.remove("show")
    element.lastElementChild.classList.add("hide")
}

export function setListName(e) {
    document.querySelector(".actual-list").children[0].textContent = e.value;
    document.getElementById("list-name").textContent = e.value;
    e.textContent = "";
    e.classList.add("hide")
    setIsSaveToFalse();
}

export function editProjectName(e) {
    let box = e;
    let input = box.children[1];
    let p = box.children[0];
    input.value = p.textContent;
    p.textContent = "";
    input.classList.remove("hide");
    input.focus()

    input.addEventListener("keypress", (e) => {
        if (e.code == "Enter") {
            setListName(e.currentTarget)
        }
    })
    input.addEventListener("blur", (e) => {
        setListName(e.currentTarget)
    })

}

export function copyText(e) {
    localStorage.setItem("clipboard", e.parentNode.parentNode.children[1].textContent);
    e.classList.add("bounce");
    setTimeout(() => {
        e.classList.remove("bounce");
    }, 400);
}