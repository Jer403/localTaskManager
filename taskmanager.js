

// VARIABLE INSTANSIATION ----------------------------------------------------------------

import { createCalendarList, createListElement } from "./tm/creator.js";
import { calendarBackwardMove, calendarForwardMove, editProjectName } from "./tm/events.js";
import { loadProjectsFromUsers, createNewProject, update, createProjectButtons } from "./tm/requests.js";
import { checkLang, getCurrentListProject, langChange, moonset, setIsSaveToTrue, sunset, themeChange, setLoginToLogout, setDaysToBackward, setDaysToForward, setActualCalendarPosition, logout } from "./tm/tmUtils.js";
import { checkIfUserDataIsLoaded, convertDateToString, getLang, getUser } from "./utils.js";


const body = document.querySelector("body");
const checkboxs = document.querySelectorAll(".list-element-checkbox");
const listbox = document.querySelectorAll(".list-element-box");
const listInput = document.querySelectorAll(".list-element-texta");

const staticLinks = document.querySelectorAll(".static-link");
const linkAuth = document.getElementById("link-auth");
const langBtn = document.getElementById("lang-btn");
const themeBtn = document.getElementById("theme-btn");
const links = document.querySelectorAll(".option-btn");

const projectsBox = document.querySelector(".lists-aside-section");
const surfaceList = document.getElementById("elements-list");
const calendarSurface = document.getElementById("calendar-lists");
const listName = document.getElementById("list-name");
const plus = document.getElementById("plus");
const saveList = document.getElementById("save");
const edit = document.getElementById("edit");
const paste = document.getElementById("paste");
const listsPlus = document.getElementById("lists-plus");
const search = document.getElementById("search");
const refresh = document.getElementById("refresh");
const forward = document.getElementById("forward");
const backward = document.getElementById("backward");

const settingsAside = document.getElementById("settings-aside");
const aside = document.getElementById("aside");

const asideLeftBtn = document.getElementById("aside-left-btn");
const asideRightBtn = document.getElementById("aside-right-btn");


const errorLog = document.querySelector(".error-log-message");

let calendarWidth = 480, user;

let date = new Date();
let dateForward = new Date();
let dateBackward = new Date();
dateBackward.setDate(date.getDate() - 1)
dateForward.setDate(date.getDate() + 1)




setDaysToBackward(0)
setDaysToForward(0)
setActualCalendarPosition(0)


document.getElementById("list-name").textContent = window.innerHeight



export function getCalendarWidth() {
	if (window.innerWidth <= 900) {
		listName.textContent = (calendarSurface.firstElementChild.offsetWidth + 20)
		return (calendarSurface.firstElementChild.offsetWidth + 20)
	}
	return calendarWidth;
}


export function getProjectsBox() {
	return projectsBox;
}

export function getErrorLog() {
	return errorLog;
}

export function getSaveList() {
	return saveList;
}

export function getListName() {
	return listName;
}

export function getSurfaceList() {
	return surfaceList;
}










//  D D D D D D   D       D     DD        D   D D D D D D             D
//  D             D       D     D D       D        D                  D
//  D              D     D      D  D      D        D                  D
//  D              D     D      D   D     D        D                  D
//  D D D D         D   D       D    D    D        D                  D
//  D               D   D       D     D   D        D                  D
//  D                D D        D      D  D        D                  D
//  D                D D        D       D D        D                  D
//  D D D D D D       D         D        DD        D                  D D D D D D


// EVENT LISTENERS -----------------------------------------------------------------------

window.addEventListener("load", async (e) => {
	createProjectButtons(await loadProjectsFromUsers())


	calendarSurface.appendChild(createCalendarList(convertDateToString(dateBackward), dateBackward.getMonth(), getLang()));
	calendarSurface.appendChild(createCalendarList(convertDateToString(date), date.getMonth(), getLang()));
	calendarSurface.appendChild(createCalendarList(convertDateToString(dateForward), dateForward.getMonth(), getLang()));
	checkLang();
	themeChange(true, themeBtn);
})

body.addEventListener("click", (e) => {
	aside.classList.remove("aside-left-move")
	settingsAside.classList.remove("aside-right-move")
})

errorLog.addEventListener("click", (e) => {
	e.currentTarget.classList.remove("move-log");
})




paste.addEventListener("click", () => {
	if (getCurrentListProject() != "null" || !getCurrentListProject()) {
		const element = createListElement(localStorage.getItem("clipboard"), "f", true, surfaceList);
		surfaceList.appendChild(element);
		saveList.classList.add("unsave")
	}
})


edit.addEventListener("click", (e) => {
	if (getCurrentListProject() != "null" || !getCurrentListProject()) {
		editProjectName(e.currentTarget.parentNode.parentNode);
	}
})

plus.addEventListener("click", (e) => {
	if (getCurrentListProject() != "null" || !getCurrentListProject()) {
		const element = createListElement("", "f", true, surfaceList);
		surfaceList.appendChild(element);
		e.currentTarget.nextElementSibling.classList.add("unsave")
	}
})

saveList.addEventListener("click", (e) => {
	if (getCurrentListProject() != "null" || !getCurrentListProject()) {
		let id = document.querySelector(".actual-list").dataset.id;
		update(id);
		setIsSaveToTrue(e.currentTarget);
	}
})

refresh.addEventListener("click", () => {
	createProjectButtons(loadProjectsFromUsers())
})

listsPlus.addEventListener("click", () => {
	createNewProject(getLang())
})

forward.addEventListener("click", (e) => {
	calendarForwardMove(calendarSurface, dateForward);
})


backward.addEventListener("click", (e) => {
	calendarBackwardMove(calendarSurface, dateBackward);
})

aside.addEventListener("click", (e) => {
	e.stopPropagation();
})

asideRightBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	settingsAside.classList.toggle("aside-right-move")
	aside.classList.remove("aside-left-move")
})

asideLeftBtn.addEventListener("click", (e) => {
	e.stopPropagation();
	aside.classList.toggle("aside-left-move")
	settingsAside.classList.remove("aside-right-move")
})





linkAuth.addEventListener("click", (e) => {
	if (e.currentTarget.dataset.id == "login") {
		location.href = "http://localhost:8080/auth?from=taskmanager";
	} else {
		logout(linkAuth);
	}
});


links.forEach((l) => {
	l.addEventListener("mouseenter", (e) => {
		let l = e.currentTarget.nextElementSibling, value = (l.firstElementChild.scrollWidth + 60) + "px";
		l.style.width = value;
	})
	l.addEventListener("mouseleave", (e) => {
		e.currentTarget.nextElementSibling.style.width = "";
	})
})


linkAuth.addEventListener("mouseenter", (e) => {
	let l = e.currentTarget.nextElementSibling, l2 = e.currentTarget.nextElementSibling.nextElementSibling, value;
	if (l.classList.contains("hide")) {
		value = (l2.firstElementChild.scrollWidth + 60) + "px";
		l2.style.width = value;
	} else {
		value = (l.firstElementChild.scrollWidth + 60) + "px";
		l.style.width = value;
	}
})
linkAuth.addEventListener("mouseleave", (e) => {
	e.currentTarget.nextElementSibling.style.width = "";
	e.currentTarget.nextElementSibling.nextElementSibling.style.width = "";
})



langBtn.addEventListener("click", () => {
	langChange();
})


themeBtn.addEventListener("click", (e) => {
	if (e.currentTarget.children.length > 1) {
		return;
	}

	if (localStorage.getItem("theme") == "l" || localStorage.getItem("theme") == null) {
		moonset(e.currentTarget, false);
		themeChange(false, themeBtn);
	} else if (localStorage.getItem("theme") == "d") {
		sunset(e.currentTarget, false);
		themeChange(false, themeBtn);
	}
})

staticLinks.forEach((s) => {
	s.addEventListener("click", (e) => {
		location.href = "http://localhost:8080/" + e.currentTarget.dataset.id;
	})
})