

export const monthsEs = [["Enero", 31], ["Febrero", 28], ["Marzo", 31], ["Abril", 30], ["Mayo", 31], ["Junio", 30], ["Julio", 31], ["Agosto", 31], ["Septiembre", 30], ["Octubre", 31], ["Noviembre", 30], ["Diciembre", 31]]
export const monthsEn = [["January", 31], ["Febrary", 28], ["March", 31], ["April", 30], ["May", 31], ["June", 30], ["July", 31], ["August", 31], ["September", 30], ["October", 31], ["November", 30], ["December", 31]]


export function getMonthEs() {
    return monthsEs;
}
export function getMonthEn() {
    return monthsEn;
}


export function newFechaUTC(dias) {
    let fecha = new Date();
    fecha.setTime(fecha.getTime() + dias * 1000 * 60 * 60 * 24);
    return fecha.toUTCString();
}

export function crearCookie(name, dias) {
    let exp = newFechaUTC(dias);
    document.cookie = `${name};expires=${exp}`;
}

export function obtenerCookie(cookieName) {
    let cookies = document.cookie;
    cookies = cookies.split(";");
    for (let i = 0; cookies.length > i; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName)) {
            return cookie.split("=")[1];
        } else {
            "No se ha encontrado una cookie con ese nombre"
        }
    }

}

export function crearSessionCookie(name) {
    document.cookie = `${name};expires=session`;
}

export function eliminarCookie(cookieName) {
    document.cookie = `${cookieName}=0;max-age=0`
}

export function getLang() {
    let lang = localStorage.getItem("lang");
    if (lang != "es" && lang != "en") {
        return "en";
    }
    return lang;
}

export function replace(string, textToR, textR) {
    let stringMod;
    if (string != null) {
        stringMod = string[0];
        for (let i = 0; i < string.length; i++) {
            if (string[i] == textToR) {
                stringMod += textR;
            } else {
                stringMod += string[i];
            }
        }
        return stringMod;
    }

}

export function convertStringDateToStringEs(date) {
    let split = date.split("-");
    return split[0] + " de " + monthsEs[split[1]][0] + " de " + split[2];
}

export function convertStringDateToStringEn(date) {
    let split = date.split("-");
    return monthsEn[split[1]][0] + " " + split[0] + ", " + split[2];
}

export function convertDateToString(date) {
    return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
}


export function saveImgInLocal(filename, file, element, id) {
    const fr = new FileReader();
    fr.readAsDataURL(file)

    fr.addEventListener("load", () => {
        let dataToStorage = `${filename}, ${fr.result}`;
        localStorage.setItem(id, dataToStorage);

        element.src = fr.result;
    })
}

export function copyTextToClipboard(text) {
    localStorage.setItem("clipboard", text);
    navigator.clipboard.writeText(text);
}

export async function sendRequest(type, contentType, bodyContent, address) {
    let header = {
        'Content-Type': contentType,
    }

    if (contentType == null) {
        header = {};
    }

    try {
        let peticion = await fetch(address, {
            method: type,
            headers: header,
            body: bodyContent
        });

        if (!peticion.ok) {
            return {
                error: true,
                status: peticion.status,
                statusText: peticion.statusText,
                message: `Error HTTP: ${peticion.status} ${peticion.statusText}`,
                type: peticion.type
            };
        }

        return peticion;
    } catch (e) {
        return {
            error: true,
            message: e.message,
            originalError: e
        };
    }
}


export function setUser(name, id) {
    localStorage.setItem("userData", JSON.stringify({ name, id }));
}


export function getUser() {
    return localStorage.getItem("userData");
}

export function removeUser() {
    localStorage.removeItem("userData");
}

export function checkIfUserDataIsLoaded(user) {
    user = getUser();
    if (!user) {
        return false;
    }
    return true;
}