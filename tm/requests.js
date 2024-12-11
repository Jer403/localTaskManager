import { getListName, getProjectsBox, getSurfaceList } from "../../taskmanager.js";
import { obtenerCookie, sendRequest } from "../utils.js";
import { createListElement, createOneProjectButton, noProjectsFound, removeInfoLabel } from "./creator.js";
import { cleanSurface, buildErrorLog, getCurrentListProject, listNameLang, loading, openFirstProject, openSelectedProjectOrFirstProject, setActualProject, setCurrentListProject, showErrors } from "./tmUtils.js";




export async function createNewProject(lang) {
    let bodyContent = {};
    bodyContent.lang = lang;
    bodyContent = JSON.stringify(bodyContent);

    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/tm/createList")

    if (!peticion.ok) {
        showErrors(peticion.status)
        return null;
    }

    let data = await peticion.json();


    removeInfoLabel(getProjectsBox(), "nop");

    let btn = createOneProjectButton(listNameLang(), data.projects)

    getProjectsBox().appendChild(btn);

    setActualProject(btn)
    loadListOnAction(btn.dataset.id);

}




export async function deleteProject(e) {

    let idToDelete = e.currentTarget.parentNode.parentNode.dataset.id;

    let boxToDelete = e.currentTarget.parentNode.parentNode;

    let pregunta = confirm("¿Esta seguro/a de que quiere eliminar ese projecto?")
    if (pregunta) {
        let data = {};
        data.listId = idToDelete;
        data = JSON.stringify(data);


        let peticion = await sendRequest('POST', 'application/json', data,
            "http://localhost:8080/api/tm/deleteList")

        if (!peticion.ok) {
            showErrors(peticion.status)
            return null;
        }

        if (getCurrentListProject() == idToDelete) {
            setCurrentListProject(null);
            cleanSurface(getSurfaceList());
        }

        getProjectsBox().removeChild(boxToDelete);

        if (getProjectsBox().children.length != 0 && getCurrentListProject() == "null") {
            openFirstProject();
        } else if (getProjectsBox().children.length == 0) {
            noProjectsFound();
        }
    }




}





export async function update(id) {                     //Updates the project in the DB

    let listDoc = JSON.parse("[]");
    let projectName = "";

    const tasksText = document.querySelectorAll(".list-element-text-main");

    projectName = getListName().textContent;


    tasksText.forEach((t) => {
        let check = "f", fav = "f";
        if (t.previousElementSibling.classList.contains("fa-check-square-o")) check = "t";
        if (t.parentNode.parentNode.classList.contains("favorite")) fav = "t";
        listDoc[listDoc.length] = JSON.parse(`
		   {"check": "${check}", 
			"txt":"${t.textContent}",
            "fav":"${fav}"}`);
    })



    let datos = {};
    datos.listId = id;
    datos.listProject = JSON.stringify(listDoc);
    datos.listProjectName = projectName;
    datos = JSON.stringify(datos);

    let peticion = await sendRequest('POST', 'application/json', datos,
        "http://localhost:8080/api/tm/updateList")

    if (!peticion.ok) {
        showErrors(peticion.status)
        return null;
    }

    buildErrorLog("green", "Datos guardados exitosamente");
}










export async function updateCalendar(e, date) {                     //Updates the project in the DB

    let listDoc = JSON.parse("[]");

    const tsks = e.children;


    Array.from(tsks).forEach(t => {
        let check = "f", fav = "f";
        if (t.firstChild.firstChild.classList.contains("fa-check-square-o")) check = "t";
        if (t.classList.contains("favorite")) fav = "t";
        listDoc[listDoc.length] = JSON.parse(`
		   {"check": "${check}", 
			"txt":"${t.firstChild.firstChild.nextElementSibling.textContent}",
            "fav":"${fav}"}`);
    })

    let datos = {};
    datos.listProject = JSON.stringify(listDoc);
    datos.date = date;
    datos = JSON.stringify(datos);

    let peticion = await sendRequest('POST', 'application/json', datos,
        "http://localhost:8080/api/tm/updateCalendarDate")

    if (!peticion.ok) {
        showErrors(peticion.status)
        return null;
    }

    buildErrorLog("green", "Datos guardados exitosamente");
}




export async function loadCalendarList(date, surface) {  //When you click in a project button or onload

    let bodyContent = {};
    bodyContent.date = date;
    bodyContent = JSON.stringify(bodyContent);


    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/tm/getCalendarDate")

    if (peticion.status == 404) {
        surface.appendChild(createListElement("", "f", "f", false, surface))
    }

    if (!peticion.ok) {
        showErrors(peticion.status)
        return null;
    }

    let project = await peticion.json();

    loadProject(surface, project, false);


}

























export async function loadListOnAction(id) {  //When you click in a project button or onload

    let bodyContent = {};
    bodyContent.listId = parseInt(id);
    bodyContent = JSON.stringify(bodyContent);

    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/tm/getListData")

    if (!peticion.ok) {
        showErrors(peticion.status)
        return null;
    }

    let project = await peticion.json();

    loadProject(getSurfaceList(), project, true);
    document.querySelectorAll(".list-box").forEach((p) => {
        if (p.dataset.id == id) {
            setActualProject(p);
        }
    })

}


export function loadProject(surface, Project, main) {       		   //This is needed in the above one  
    cleanSurface(surface);
    let listDoc = JSON.parse(Project.listProject);
    if (listDoc) {
        listDoc.forEach((l) => {
            const element = createListElement(l.txt, l.check, l.fav, main, surface);
            surface.appendChild(element);
        })
    }
    if (surface == getSurfaceList()) {
        getListName().textContent = Project.listProjectName;
    }
}


export function createProjectButtons(Lists) {       //This needs the next one
    getProjectsBox().innerHTML = "";
    if (!Lists) {
        return null;
    }
    Lists.then(data => {
        if (!data) {
            return;
        }
        else if (data.projects != "") {
            let nombres = data.listProjectName.split("/");
            let ids = data.projects.split("/");

            for (let i = 0; i < ids.length; i++) {
                getProjectsBox().appendChild(createOneProjectButton(nombres[i], ids[i]))
            }

            openSelectedProjectOrFirstProject();
        } else {
            getProjectsBox().appendChild(noProjectsFound())
        }

    });

}
export async function loadProjectsFromUsers() {   //Gets all the projects ids
    let bodyContent = {}
    bodyContent.tiempo = "" + obtenerCookie("keep");
    bodyContent = JSON.stringify(bodyContent);

    loading(getProjectsBox())

    let peticion = await sendRequest('POST', 'application/json', bodyContent,
        "http://localhost:8080/api/tm/getAllLists")


    if (!peticion.ok) {
        showErrors(peticion.status)
        return null;
    }

    let lists = await peticion.json();

    return lists;
}