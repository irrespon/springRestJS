
let errId = document.getElementById('errId')
let currentLocation = window.location;

let errMessage = errM => {
    let temp = ''
    if(errM === '?error') {
        temp += '<p class="alert alert-danger"> Invalid email and password.</p>'
    } else if (errM === '?logout') {
    temp += '<p class="alert alert-success"> You have been logged out.</p>'
    }
    errId.innerHTML = temp
}

errMessage(currentLocation.search)



