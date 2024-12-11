import { getSaveList } from "../../taskmanager.js";
import { appearInput, setIsSaveToFalse, setIsSaveToTrue } from "./tmUtils.js";
import { convertStringDateToStringEn, convertStringDateToStringEs, getMonthEn, getMonthEs } from "../utils.js";
import { copyText, dragLeaveEvent, dragOverEvent, dropEvent, editProjectName, hideModifiButtons, setInputEventListener, setLiEventListener, showModifiButtons } from "./events.js";
import { deleteProject, loadCalendarList, loadListOnAction, updateCalendar } from "./requests.js";
import { checkFromBox, checkTheBox, getCurrentListProject, setActualProject } from "./tmUtils.js";

export function createCalendarList(date, month, lang) {
    const list = document.createElement("DIV");
    const box = document.createElement("DIV");
    const ul = document.createElement("UL");
    const h = document.createElement("H2");
    const p = document.createElement("P");
    const div = document.createElement("DIV");
    const plus = document.createElement("BUTTON");
    const save = document.createElement("BUTTON");
    const plusSpan = document.createElement("SPAN");
    const saveSpan = document.createElement("SPAN");




    plus.classList.add("calendar-action-btn", "calendar-plus", "theme");
    save.classList.add("calendar-action-btn", "save-calendar", "theme");
    plusSpan.classList.add("fa", "fa-plus");
    saveSpan.classList.add("fa", "fa-save");
    plus.setAttribute("style", "display:flex;")
    save.setAttribute("style", "display:flex;")
    plus.setAttribute("title", "Add calendar task")
    save.setAttribute("title", "Save calendar list")

    plus.appendChild(plusSpan);
    save.appendChild(saveSpan);

    div.classList.add("action-btns-box");

    p.classList.add("calendar-date");
    h.classList.add("calendar-month");

    box.classList.add("top-calendar", "theme");
    ul.classList.add("elements-list", "calendar-element-list");

    list.classList.add("calendar-list", "theme");

    if (localStorage.getItem("theme") == "d") {
        box.classList.add("top-calendar-dark")
        div.classList.add("action-btns-box-dark")
        list.classList.add("calendar-list-dark");
        plus.classList.add("calendar-action-btn-dark");
        save.classList.add("calendar-action-btn-dark");
    }

    div.appendChild(plus);
    div.appendChild(save);

    box.appendChild(h);
    box.appendChild(p);
    box.appendChild(div);

    list.appendChild(box);
    list.appendChild(ul);

    if (lang == "es") {
        p.textContent = convertStringDateToStringEs(date);
        h.textContent = getMonthEs()[month][0];
    } else {
        p.textContent = convertStringDateToStringEn(date);
        h.textContent = getMonthEn()[month][0];
    }


    list.dataset.id = date;

    plus.addEventListener("click", (e) => {
        if (getCurrentListProject() != "null") {
            ul.appendChild(createListElement("", "f", false, ul))
            e.currentTarget.nextElementSibling.classList.add("unsave")
        }
    })

    save.addEventListener("click", (e) => {
        if (getCurrentListProject() != "null") {
            let updated = updateCalendar(e.currentTarget.parentNode.parentNode.parentNode.lastElementChild, date)
            if (updated) {
                setIsSaveToTrue(e.currentTarget)
            }
        } else {
            showErrors("usernameNotFoundFromToken")
        }
    })

    loadCalendarList(date, ul)

    return list;
}



export function createListElement(text, check, fav, main, surface) {
    let saveBtn;
    let txHeight = 23;
    const li = document.createElement("LI");
    const box = document.createElement("DIV");
    const span = document.createElement("SPAN");
    const p = document.createElement("P");
    const texta = document.createElement("TEXTAREA");
    const div = document.createElement("DIV");
    const edit = document.createElement("SPAN")
    const del = document.createElement("SPAN");
    const copy = document.createElement("SPAN");
    const star = document.createElement("SPAN");

    star.classList.add("fa", "fa-star", "list-element-star", "disappear");
    edit.classList.add("fa", "fa-edit", "list-element-edit", "disappear");
    del.classList.add("fa", "fa-trash", "list-element-del", "disappear");
    copy.classList.add("fa", "fa-copy", "list-element-copy", "disappear");

    div.classList.add("modifi-box");
    texta.classList.add("list-element-texta", "hide");
    p.classList.add("list-element-text");

    li.classList.add("list-element", "theme");
    li.setAttribute("draggable", "true")

    if (main) {
        p.classList.add("list-element-text-main")
        span.classList.add("list-element-checkbox-main");
        li.classList.add("list-element-main");
    } else {
        texta.classList.add("calendar-texta");
        txHeight = 17;
        saveBtn = surface.previousElementSibling.lastElementChild.lastElementChild;
    }
    span.classList.add("fa", "fa-square-o", "list-element-checkbox");

    box.classList.add("list-element-box");


    if (localStorage.getItem("theme") == "d") {
        li.classList.add("list-element-dark");
    }

    div.appendChild(copy);
    div.appendChild(edit);
    div.appendChild(del);
    div.appendChild(star);

    box.appendChild(span);
    box.appendChild(p);
    box.appendChild(texta);
    box.appendChild(div);

    li.appendChild(box);


    p.textContent = text;


    edit.addEventListener("click", (e) => {
        e.stopPropagation();
        appearInput(e.currentTarget.parentNode.parentNode);
    })
    del.addEventListener("click", (e) => {
        e.stopPropagation();

        if (li.classList.contains("favorite")) {
            let ask = confirm("Estas seguro/a que quieres eliminar esta tarea?")
            if (ask) {
                (saveBtn) ? setIsSaveToFalse(saveBtn) : setIsSaveToFalse();
                surface.removeChild(e.currentTarget.parentNode.parentNode.parentNode)
            }
        }
    })


    star.addEventListener("click", (e) => {
        e.stopPropagation();
        setIsSaveToFalse(saveBtn)
        li.classList.toggle("favorite")
    })

    if (check == "t") {
        checkFromBox(box);
    }

    if (fav == "t") {
        li.classList.add("favorite")
    }

    span.addEventListener("click", (e) => {
        e.stopPropagation();
        checkTheBox(e.currentTarget);
    })

    copy.addEventListener("click", (e) => {
        e.stopPropagation();
        copyText(e.currentTarget);
    });

    setLiEventListener(li, saveBtn);
    (saveBtn) ? setInputEventListener(texta, txHeight, saveBtn) : setInputEventListener(texta, txHeight)


    li.addEventListener("dragstart", (e) => {
        let pos = Array.from(e.currentTarget.parentNode.children).findIndex(item => item === e.currentTarget);
        e.dataTransfer.setData("element", pos)
    })
    li.addEventListener("dragover", (e) => {
        e.preventDefault();
        dragOverEvent(e);
    })
    li.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dragLeaveEvent(e);
    })
    li.addEventListener("drop", (e) => {
        dropEvent(e)
    })

    return li;
}



export function noProjectsFound() {
    let noProjects = document.createElement("LABEL");
    noProjects.setAttribute("style", "margin-top: 8px")
    noProjects.id = "nop";
    noProjects.textContent = "No tienes ningun projecto";
    return noProjects;
}


export function createInfoLabel(text, id) {
    let label = document.createElement("LABEL");
    label.setAttribute("style", "margin-top: 8px")
    label.id = id;
    label.textContent = text;
    return label;
}


export function removeInfoLabel(box, id) {
    console.log(box, id)
    let label = box.querySelector("#" + id);
    if (label) {
        box.removeChild(label);
    }
}


export function createOneProjectButton(nombre, id) {
    const button = document.createElement("DIV");
    const p = document.createElement("P");
    const input = document.createElement("INPUT");
    input.classList.add("list-input", "hide");
    input.setAttribute("maxlength", "50");
    button.classList.add("list-box");
    button.appendChild(p);
    button.appendChild(input);
    p.classList.add("list-name");
    p.textContent = nombre;
    button.dataset.id = id;
    button.appendChild(createModifiBtns());
    button.addEventListener("mouseenter", (e) => { showModifiButtons(e.currentTarget); })
    button.addEventListener("mouseleave", (e) => { hideModifiButtons(e.currentTarget); })
    button.addEventListener("click", (e) => {
        if (getSaveList().classList.contains("unsave") && e.currentTarget.dataset.id != getCurrentListProject()) {
            update(getCurrentListProject())
        }
        if (e.currentTarget.dataset.id != getCurrentListProject()) {
            loadListOnAction(e.currentTarget.dataset.id);
            setActualProject(e.currentTarget);
            setIsSaveToTrue();
        }
    })
    return button
}




export function createModifiBtns() {
    const div = document.createElement("DIV");
    div.classList.add("modifi-btn-box", "hide", "theme");
    if (localStorage.getItem("theme") == "d") {
        div.classList.add("modifi-btn-box-dark");
    }

    const spanDel = document.createElement("SPAN");
    spanDel.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteProject(e)
    });
    const spanEdit = document.createElement("SPAN");
    spanEdit.addEventListener("click", (e) => {
        editProjectName(e.currentTarget.parentNode.parentNode);
    })

    spanDel.classList.add("list-modifi-btn", "del", "fa", "fa-trash")
    spanEdit.classList.add("list-modifi-btn", "edit", "fa", "fa-edit")


    div.appendChild(spanEdit);
    div.appendChild(spanDel);

    return div;
}


