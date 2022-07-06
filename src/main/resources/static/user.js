const urlAllRoles = "http://localhost:8080/allRoles"
const urlLoginUser = "http://localhost:8080/loginUser"

const id = document.getElementById('id')
const name = document.getElementById('name')

const email = document.getElementById('email')

const nURoles = document.getElementById('newUserRoles')

const loginUserTable = document.getElementById("loginUserId")
const loginUserEmail = document.getElementById("emailUser")

let rolesT = ''

const allRoles = (allRolesTemp, strHtml) => {
    rolesT = allRolesTemp
    let temp = ""
    rolesT.forEach(r => {
        temp += "<option value = " + r.id + ">" + r.name + "</option>"
    })
    strHtml.innerHTML = temp
}

let rolesName = (userRoles, rolesT) => {
    let tempRole = ""
    userRoles.forEach((r, i, arr) => {
        rolesT.forEach(rt => {
            if (rt.id === r.id) {
                tempRole += rt.name + ((i === arr.length - 1) ? '' : " ");
            }
        })
    })
    return tempRole
}

const usersTableJS = (users, uTable) => {
    let arrUsers = []
    let statusArrUser = '';

    if(!Array.isArray(users)){
        arrUsers.push(users)
        statusArrUser = true
    } else {
        arrUsers = users
    }

    if (arrUsers.length > 0) {
        let temp = ''

        arrUsers.forEach(u => {
            temp += "<tr id=" + u.id + ">";
            temp += "<td>" + u.id + "</td>";
            temp += "<td>" + u.name + "</td>";
            temp += "<td>" + u.surname + "</td>";
            temp += "<td>" + u.age + "</td>";
            temp += "<td>" + u.email + "</td>";
            temp += "<td>" + rolesName(u.roles, rolesT) + "</td>";
            if(!statusArrUser) {
                temp += '<td><button class="btnEdit btn btn-info" type="button" id="editUser">Edit</button></td>';
                temp += '<td><button class="btnDelete btn btn-danger" type="button" id="deleteUser">Delete</button></td>';
            }
            temp += '</tr>'
        })
        uTable.innerHTML = temp;
    }
}

let lUserEmail = user => {
    let temp = ""
    temp += '<li class="list-inline-item h4">' + user.email + '</li>';
    temp += '<li class="list-inline-item h4 font-weight-light">with roles:</li>';
    user.roles.forEach(r=>{
        temp += '<li class="list-inline-item h4 font-weight-light">' + r.name + '</li>'
    })
    loginUserEmail.innerHTML = temp
}

async function fetchAsyncT(dataDB, url, uTable) {
    try {
        const resp = await fetch(url)
        const data = await resp.json()
        dataDB(data, uTable)

    } catch (e) {
        console.error(e)
    } finally {
    }
}

fetchAsyncT(allRoles, urlAllRoles, nURoles)

fetchAsyncT(lUserEmail, urlLoginUser, loginUserEmail)

fetchAsyncT(usersTableJS, urlLoginUser, loginUserTable)