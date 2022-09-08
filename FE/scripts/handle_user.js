const baseUrl = 'http://localhost:3000/api/'
const login = () => {
    const username = $("#login_username").val()
    const password = $("#login_password").val()

    // async
    $.ajax({
        url: `${baseUrl}auth/login`,
        type: 'POST',
        data: {username, password},
        success: function (data) {

            sessionStorage.setItem('username', data.username)
            sessionStorage.setItem('userId', data.userId)
            sessionStorage.setItem('accessToken', data.token)
            window.location.pathname = '/'
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log({xhr, thrownError})
            alert(`${thrownError}: ${xhr.responseJSON.message}`);
        }
    })
}

// send this data to be
const register = () => {
    const username = $("#register_username").val()
    const password = $("#register_password").val()
    const repeatPassword = $("#register_repeat_password").val()
    $.ajax({
        url: `${baseUrl}auth/register`,
        type: 'POST',
        data: {username, password, repeatPassword},
        success: function (data) {
            console.log(data)
            alert('Successful registration. You can log in now')
            location.reload()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log({xhr, thrownError})
            alert(`${thrownError}: ${xhr.responseJSON.message}`);
        }
    })
}