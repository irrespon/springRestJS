const urlUsers = "http://localhost:8080/users"
const urlAllRoles = "http://localhost:8080/allRoles"
const urlDelete = "http://localhost:8080/deleteUser/"
const urlLoginUser = "http://localhost:8080/loginUser"

const id = document.getElementById('id')
const name = document.getElementById('name')
const surname = document.getElementById('surname')
const age = document.getElementById('age')
const email = document.getElementById('email')
const password = document.getElementById('password')
const roles = document.getElementById('roles')
const nUName = document.getElementById('newUserName')
const nUSurname = document.getElementById('newUserSurname')
const nUAge = document.getElementById('newUserAge')
const nUEmail = document.getElementById('newUserEmail')
const nUPassword = document.getElementById('newUserPassword')
const nURoles = document.getElementById('newUserRoles')
const userTable = document.getElementById("usersId")
const loginUserTable = document.getElementById("loginUserId")
const loginUserEmail = document.getElementById("emailUser")

let editModalBS = new bootstrap.Modal(document.getElementById('editModal'))

const newUserTab = document.getElementById('newUser-tab')
const usersTableTab = document.getElementById('usersTable-tab')
const nUser = document.getElementById('newUser')
const usersTable = document.getElementById('usersTable')

const submitButtonBS = document.getElementById('submitButton')
const submitButtonNewUserBS = document.getElementById('submitButtonNewUser')

let nameButton = ''
let rolesT = ''

//получаем все существующие роли из базы
//формируем роли для нового юзера или существующего юзера для редактирования
const allRoles = (allRolesTemp, strHtml) => {
    let temp = ""
    rolesT = allRolesTemp
    rolesT.forEach(r => {
        temp += "<option value = " + r.id + ">" + r.name + "</option>"
    })
    strHtml.innerHTML = temp
}

//данные для редактирования пользователя
const userOne = (user, strHtml) => {
    let temp = ""
    id.value = user.id
    name.value = user.name
    surname.value = user.surname
    age.value = user.age
    email.value = user.email
    password.value = user.password
    rolesT.forEach(r => {
        temp += "<option value = " + r.id + ">" + r.name + "</option>"
    })
    strHtml.innerHTML = temp
}

//формирование ролей, сравнивая роли по id роли юзера и роли в базе, получение имен ролей из базы
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

//формирование ролей, сравнивая роли по имени=id роли юзера и роли в базе, получение имен ролей из базы
let rolesNameExistRoles = (userRoles, rolesT) => {
    let tempRole = ""
    userRoles.forEach((r, i, arr) => {
        rolesT.forEach(rt => {
            if (rt.id == r) {
                tempRole += rt.name + ((i === arr.length - 1) ? '' : " ");
            }
        })
    })
    return tempRole
}

//таблица со всеми юзерами
const usersTableJS = (users, strHtml) => {
    //массив юзеров
    let arrUsers = []
    let statusArrUser = '';

    //если пользователь не массив, то добавляем в пустой массив
    if(!Array.isArray(users)){
        arrUsers.push(users)
        statusArrUser = true
    } else {
        arrUsers = users
    }

    //массив больше 0
    if (arrUsers.length > 0) {
        let temp = ''
        let tempTable = ''

        //если создаем нового пользователя, то берем инфу из существующей таблицы
        if (nameButton === 'newUser') {
            tempTable = userTable.innerHTML
        } else {
            tempTable = ''
        }

        //перебираем юзеров, форимруем таблицу юзеров с данными
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

        tempTable = tempTable + temp
        //добавляем в html таблицу
        strHtml.innerHTML = tempTable;
    }
}

//функция отслеживания события клик в соответсвующей строке
const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}

//id пользователя
let idForm = 0

//отслеживаем событие клик на кнопке edit в таблице юзеров
on(document, 'click', '.btnEdit', e => {
    nameButton = 'editUser'
    const str = e.target.parentNode.parentNode
    //определяем id пользователя в строке таблицы
    idForm = str.children[0].innerHTML

    //получаем данные ползователя из базы по id передаем в функцию -> функцию пользователя, url, строку html для ролей
    //(остальной html существует на странице)
    fetchAsyncT(userOne, urlUsers + "/" + idForm, roles)
    //отключаем read-only для полей, кроме id
    name.readOnly = false
    surname.readOnly = false
    age.readOnly = false
    email.readOnly = false
    password.readOnly = false
    roles.readOnly = false
    roles.disabled = false

    //атрибуты Edit для кнопки модального окна, если нажимаем Edit в таблице
    submitButtonBS.setAttribute('type','button')
    submitButtonBS.setAttribute('class','btn btn-info')
    submitButtonBS.textContent = 'Edit'

    //показываем модальное окно
    editModalBS.show()
})

//отслеживаем событие клик на кнопке delete в таблице юзеров
on(document, 'click', '.btnDelete', e => {
    nameButton = 'deleteUser'
    const str = e.target.parentNode.parentNode
    //определяем id пользователя в строке таблицы
    idForm = str.children[0].innerHTML

    //получаем данные ползователя из базы по id передаем в функцию -> функцию пользователя, url, строку html для ролей
    //(остальной html существует на странице)
    fetchAsyncT(userOne, urlUsers + "/" + idForm, roles)
    //включаем read-only для всех полей
    name.readOnly = true
    surname.readOnly = true
    age.readOnly = true
    email.readOnly = true
    password.readOnly = true
    roles.readOnly = true
    roles.disabled = true

    //атрибуты delete для кнопки модального окна, если нажимаем Delete в таблице
    submitButtonBS.setAttribute('type','button')
    submitButtonBS.setAttribute('class','btn btn-danger')
    submitButtonBS.textContent = 'Delete'
    //показываем модальное окно
    editModalBS.show()
})

//кнопка edit и delete модального окна
submitButtonBS.onclick = (e) => {
    //роли в модальном окне
    let rolesInModal = document.getElementById('roles')
    //ранее а userOne id.value присвоили user.id
    //по id получаем
    let idTr = document.getElementById(id.value)

    let tempRol = []
    //определяем выбранные роли
    for (let i = 0; i < rolesInModal.length; i++) {
        if (rolesInModal.options[i].selected) {
            tempRol.push(rolesInModal.options[i].value)
        }
    }

    //объект пользователя
    let eUser = {
        age: age.value,
        name: name.value,
        surname: surname.value,
        id: id.value,
        email: email.value,
        password: password.value,
        roles: tempRol
    }
    //передаем данные в базу
    if (nameButton === 'editUser') {
        fetch(urlUsers, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eUser)
        })
            .then(response => response.json())

        idTr.children[1].innerHTML = name.value
        idTr.children[2].innerHTML = surname.value
        idTr.children[3].innerHTML = age.value
        idTr.children[4].innerHTML = email.value
        idTr.children[5].innerHTML = rolesNameExistRoles(tempRol, rolesT)

        editModalBS.hide()
    } else if (nameButton === 'deleteUser') {

        fetch(urlDelete + id.value, {
            method: 'DELETE'
        })
            .then(response => response.json())

        idTr.remove()
        editModalBS.hide()
    }
}

//отслеживаем клик вкладки нового пользователя, пустые поля
newUserTab.addEventListener('click', () => {
    nameButton = 'newUser'
    nUName.value = ''
    nUSurname.value = ''
    nUAge.value = ''
    nUEmail.value = ''
    nUPassword.value = ''
})

//кнопка создания пользователя
submitButtonNewUserBS.onclick = () => {
    nameButton = 'newUser'
    //роли для нового юзера
    let rolesNewUser = document.getElementById('newUserRoles')
    let tempRol = []
    //выбранные роли
    for (let i = 0; i < rolesNewUser.length; i++) {
        if (rolesNewUser.options[i].selected) {
            tempRol.push(rolesNewUser.options[i].value)
        }
    }

    let eUser = {
        age: nUAge.value,
        name: nUName.value,
        surname: nUSurname.value,
        email: nUEmail.value,
        password: nUPassword.value,
        roles: tempRol
    }

    fetch(urlUsers, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eUser)
    })
        .then(response => response.json())
        .then(data => {
            const users = []
            users.push(data)
            usersTableJS(users,userTable)
        })

    //переключаемся на вкалдку с таблицей
    newUserTab.classList.remove('active')
    newUserTab.classList.remove('show')
    newUserTab.ariaSelected = 'false'
    nUser.classList.remove('active')
    nUser.classList.remove('show')
    usersTableTab.classList.add('active')
    usersTableTab.classList.add('show')
    usersTableTab.ariaSelected = 'true'
    usersTable.classList.add('active')
    usersTable.classList.add('show')
    return false
}

//залогиненный пользователь, для верхней строки
let lUserEmail = (user, strHtml) => {
    let temp = ""
    temp += '<li class="list-inline-item h4">' + user.email + '</li>';
    temp += '<li class="list-inline-item h4 font-weight-light">with roles:</li>';
    user.roles.forEach(r=>{
        temp += '<li class="list-inline-item h4 font-weight-light">' + r.name + '</li>'
    })
    strHtml.innerHTML = temp
}

async function fetchAsyncT(dataDB, url, strHtml) {
    try {
        const resp = await fetch(url)
        const data = await resp.json()
        dataDB(data, strHtml)

    } catch (e) {
        console.error(e)
    } finally {
    }
}

//считываем роли
fetchAsyncT(allRoles, urlAllRoles, nURoles)
//считываем всех пользователей
fetchAsyncT(usersTableJS, urlUsers, userTable)
//вызов для верхней строки
fetchAsyncT(lUserEmail, urlLoginUser, loginUserEmail)
//вызов для строки залогиненого пользовател
fetchAsyncT(usersTableJS, urlLoginUser, loginUserTable)
