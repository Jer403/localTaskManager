import { getErrorLog, getProjectsBox, getSaveList } from "../../taskmanager.js";
import { convertStringDateToStringEn, convertStringDateToStringEs, eliminarCookie, getMonthEn, getMonthEs, removeUser } from "../utils.js";
import { loadListOnAction } from "./requests.js";

export function appearInput(e) {
    let input = e.children[2];
    let text = e.children[1];
    input.classList.remove("hide");
    input.value = text.textContent;
    text.textContent = "";
    if (input.value.length > 112) {
        input.style.height = (input.scrollHeight) + "px";
    }
    e.parentNode.classList.add("list-element-open")
    input.focus();
}

export function setValue(e) {
    let input = e;
    let text = e.previousElementSibling;
    text.textContent = input.value;
    input.value = "";
    input.classList.add("hide");
    e.parentNode.parentNode.classList.remove("list-element-open")
}

export function checkTheBox(e) {
    e.nextElementSibling.classList.toggle("check");
    e.classList.toggle("fa-check-square-o");
    e.classList.toggle("fa-square-o");
}

export function checkFromBox(e) {
    e.firstElementChild.nextElementSibling.classList.toggle("check");
    e.firstElementChild.classList.toggle("fa-check-square-o");
    e.firstElementChild.classList.toggle("fa-square-o");
}

export function appearModBtns(e) {
    e.lastElementChild.classList.remove("disappear");
}

export function disappearModBtns(e) {
    e.lastElementChild.classList.add("disappear");
}

export function OnInput(e) {
    let limit, height;

    if (e.currentTarget.classList.contains("calendar-texta")) {
        limit = 48;
        height = 18;
    } else {
        limit = 128;
        height = 23;
    }
    this.style.height = 'auto';
    if (this.value.length < limit) {
        this.style.height = (height) + "px";
        return;
    }
    this.style.height = (this.scrollHeight) + "px";
}

export function setIsSaveToFalse(saveBtn = getSaveList()) {
    saveBtn.classList.add("unsave")
}

export function setIsSaveToTrue(saveBtn = getSaveList()) {
    saveBtn.classList.remove("unsave")
}

export function setErrorLogToDefault() {
    getErrorLog().classList.remove("move-log");
}

export function buildErrorLog(color, text) {
    let errorLog = getErrorLog();
    if (color == "red") {
        errorLog.classList.add("red");
        errorLog.classList.remove("green");
    } else {
        errorLog.classList.remove("red");
        errorLog.classList.add("green");
    }
    errorLog.classList.add("move-log");
    errorLog.textContent = text;
    setTimeout(() => {
        setErrorLogToDefault();
    }, 10000)
}

export function showErrors(error) {
    if (error == "TypeError: Failed to fetch") {
        buildErrorLog("red", "Por favor conectese a internet para cargar sus projectos")
    } else if (error == "usernameNotFoundFromToken") {
        buildErrorLog("red", "Inicie sesion, por favor")
    } else if (error == "repositoryCouldNotSave") {
        buildErrorLog("red", "No se pudo guardar el projecto")
    } else if (error == "Internal Server Error") {
        buildErrorLog("red", "Ha ocurrido un error")
    } else if (error == "JWT") {
        buildErrorLog("red", "Inicie Sesión para cargar sus listas")
    } else if (error == 403) {
        buildErrorLog("red", "No tienes permisos para acceder a este projecto")
    } else if (error == 401) {
        buildErrorLog("red", "Inicie Sesión para cargar sus listas")
        removeUser();
    }
}

export function loading(e) {
    const span = document.createElement("SPAN")
    span.classList.add("loading", "fa", "fa-spinner")
    e.appendChild(span);
}

export function cleanActualProject() {

    const projectsBtns = document.querySelectorAll(".list-box");

    projectsBtns.forEach((p) => {
        p.classList.remove("actual-list")
    })
}


export function cleanActualElement(iteratorClass, removeClass) {
    const elements = document.querySelectorAll(iteratorClass);

    elements.forEach((e) => {
        e.classList.remove(removeClass)
    })
}


export function setActualProject(e) {
    cleanActualElement(".list-box", "actual-list");
    e.classList.add("actual-list")
    setCurrentListProject(e.dataset.id)
}

export function openFirstProject() {
    loadListOnAction(getProjectsBox().firstChild.dataset.id)
    cleanActualElement(".list-box", "actual-list");
    setActualProject(getProjectsBox().firstChild);
}

export function openSelectedProjectOrFirstProject() {
    if (getCurrentListProject() == "null") {
        openFirstProject();
        return;
    }
    let projectos = document.querySelectorAll(".list-box"), found = false;
    projectos.forEach((p) => {
        if (p.dataset.id == getCurrentListProject()) {
            loadListOnAction(p.dataset.id);
            cleanActualElement(".list-box", "actual-list");
            setActualProject(p);
            found = true;
        }
    })
    if (!found) {
        openFirstProject();
    }

}




export function cleanSurface(surface) {
    surface.innerHTML = "";
}




export function setCurrentListProject(id) {
    localStorage.setItem("CurrentListProject", id)
}

export function getCurrentListProject() {
    return localStorage.getItem("CurrentListProject")
}





export function setLoginToLogout(linkAuth) {
    linkAuth.dataset.id = "logout";
    linkAuth.firstElementChild.classList.remove("fa-sign-in-alt");
    linkAuth.firstElementChild.classList.add("fa-sign-out-alt");
    linkAuth.nextElementSibling.classList.toggle("hide");
    linkAuth.nextElementSibling.nextElementSibling.classList.toggle("hide");
}

export function setLogoutToLogin(linkAuth) {
    linkAuth.dataset.id = "login";
    linkAuth.firstElementChild.classList.add("fa-sign-in-alt");
    linkAuth.firstElementChild.classList.remove("fa-sign-out-alt");
    linkAuth.nextElementSibling.classList.toggle("hide");
    linkAuth.nextElementSibling.nextElementSibling.classList.toggle("hide");
}



export function logout(linkAuth) {
    setLogoutToLogin(linkAuth);
    eliminarCookie("ssid");
    eliminarCookie("keep");
    location.href = "http://localhost:8080/auth?from=taskmanager";
}


export function authenticate(token) {
    setLoginToLogout();
    if (obtenerCookie("keep") == "true") {
        crearCookie(`hs=${token}`, 365)
    } else {
        crearCookie(`hs=${token}`, 2)
    }
}








export function langChange() {
    let lang;
    if (getLang() == "en") {
        lang = "es";
        localStorage.setItem("lang", "es")
    } else {
        lang = "en";
        localStorage.setItem("lang", "en")
    }


    const langElements = document.querySelectorAll(".lang");

    langElements.forEach((e) => {
        e.textContent = e.getAttribute(lang);
    })

    const calendarElements = document.querySelectorAll(".calendar-list");

    calendarElements.forEach((c) => {
        const name = c.firstElementChild.firstElementChild;
        const date = name.nextElementSibling;
        if (lang == "es") {
            date.textContent = convertStringDateToStringEs(c.dataset.id);
            name.textContent = getMonthEs()[c.dataset.id.split("-")[1]][0]
        } else {
            date.textContent = convertStringDateToStringEn(c.dataset.id);
            name.textContent = getMonthEn()[c.dataset.id.split("-")[1]][0]
        }

    })


}



export function checkLang() {
    if (localStorage.getItem("lang") == "es") {
        const langElements = document.querySelectorAll(".lang");

        langElements.forEach((e) => {
            e.textContent = e.getAttribute("es");
        })

        const calendarElements = document.querySelectorAll(".calendar-list");

        calendarElements.forEach((c) => {
            const name = c.firstElementChild.firstElementChild;
            const date = name.nextElementSibling;
            date.textContent = convertStringDateToStringEs(c.dataset.id);
            name.textContent = getMonthEs()[c.dataset.id.split("-")[1]][0];
        })
    }
}





export function listNameLang() {
    if (localStorage.getItem("lang") == "es") {
        return "Lista sin nombre";
    }
    return "Untitled List";
}



export function sunset(e) {
    let first = e.firstElementChild;
    const current = e;
    const moon = document.createElement("SPAN");
    moon.classList.add("fas", "fa-moon", "option-icon", "arise")
    first.classList.remove("arise");
    first.classList.add("sunset");
    e.insertBefore(moon, first);
    setTimeout(() => {
        current.removeChild(first)
    }, 800);
}

export function moonset(e) {
    let first = e.firstElementChild;
    const current = e;
    const sun = document.createElement("SPAN");
    sun.classList.add("fas", "fa-sun", "option-icon", "arise")
    first.classList.remove("arise");
    first.classList.add("sunset");
    e.insertBefore(sun, first);
    setTimeout(() => {
        current.removeChild(first)
    }, 800);
}











export function themeChange(fromWindow, themeBtn) {
    let theme;

    if (fromWindow) {
        if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
            theme = "l";
        } else {
            theme = "d";
            moonset(themeBtn, fromWindow);
        }
    } else {
        if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
            theme = "d";
            localStorage.setItem("theme", "d")
        } else {
            theme = "l";
            localStorage.setItem("theme", "l")
        }
    }

    const elementsToChange = document.querySelectorAll(".theme");

    if (theme == "d") {
        elementsToChange.forEach((e) => {
            const [classToChange] = e.classList;
            e.classList.add(classToChange + "-dark")
        })
    } else if (theme == "l") {
        elementsToChange.forEach((e) => {
            const [classToChange] = e.classList;
            e.classList.remove(classToChange + "-dark")
        })
    }
}





export function getActualCalendarPosition() {
    return Number(localStorage.getItem("calendarActualPosition"))
}

export function setActualCalendarPosition(position) {
    localStorage.setItem("calendarActualPosition", position)
}



export function getDaysToForward() {
    return Number(localStorage.getItem("calendarDaysToForward"))
}

export function setDaysToForward(days) {
    localStorage.setItem("calendarDaysToForward", days)
}

export function getDaysToBackward() {
    return Number(localStorage.getItem("calendarDaysToBackward"))
}

export function setDaysToBackward(days) {
    localStorage.setItem("calendarDaysToBackward", days)
}



