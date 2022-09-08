const baseUrl = 'http://localhost:3000/api/'

const clearHome = () => {
    $("#cards-overview").html('')
}

// calls route,
const fetchData = () => {

    fetch(`${baseUrl}note/get-notes/${sessionStorage.getItem('username')}`, { // send this to BE
        headers: {
            'authorization': `Bearer ${sessionStorage.getItem('accessToken')}` // send for authorization
        }
    })
        .then((response) => response.json())
        .then(({notes}) => {
            if (notes.length > 0) {
                notes.forEach((item) => {
                    item.id = item.timestamp
                    $("#cards-overview").append(renderSingleNote(item))
                })
            }
        })
}
const confirmAddNewNote = () => {
    const title = $("#note_title").val()
    const content = $("#note_content").val()
    console.log("DATA: ", title, content)
    const username = sessionStorage.getItem('username')
    $.ajax({
        url: `${baseUrl}note/add`,
        headers: {'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`},
        type: 'PUT',
        data: {username, title, content},
        success: function () {
            $(`#add_new_note`).hide()
            $(".modal-backdrop").remove()
            clearHome()
            fetchData()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log({xhr, thrownError})
            alert(`${thrownError}: ${xhr.responseJSON.message}`);
        }
    })

}

const confirmUpdate = (id) => {
    const username = sessionStorage.getItem('username')
    const content = $(`#update-note-text-${id}`).val()
    $.ajax({
        url: `${baseUrl}note/update`,
        headers: {'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`},
        type: 'PUT',
        data: {username, timestamp: id, content},
        success: function () {
            $(`#note-${id}`).remove()
            $(`#note modal-${id}`).hide()
            $(".modal-backdrop").remove()
            clearHome() // clear notes, reloades again
            setTimeout(() => {
                fetchData()
            }, 0)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log({xhr, thrownError})
            alert(`${thrownError}: ${xhr.responseJSON.message}`);
        }
    })
}

const confirmDelete = (id) => {
    const username = sessionStorage.getItem('username')

    $.ajax({
        url: `${baseUrl}note/delete/${username}/${id}`,
        headers: {'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`},
        type: "DELETE",
        success: function () {
            $(`#note-${id}`).remove()
            $(`#note modal-${id}`).hide()
            $(".modal-backdrop").remove()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log({xhr, thrownError})
            alert(`${thrownError}: ${xhr.responseJSON.message}`);
        }
    })
}

const renderSingleNote = (data) => {
    return `
    <div class='col-lg-3 col-md-4 col-sm-6 col-xs-12 single-note-wrapper' id="note-${data?.id}">
        <div class='inner-wrapper'>
            <div class='title'>
                ${data?.title}
            </div>
            <div class='content'>
                ${data?.content}
            </div>
            <div class='actions text-right'>
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#view_${data.id}">View</button>
                <button type="button" class='btn btn-info' data-toggle="modal" data-target="#edit_${data.id}" >Edit</button>
                <button type="button" class='btn btn-danger' data-toggle="modal" data-target="#delete_${data.id}" >Delete</button>
            </div>
        </div>
        <!-- VIEW -->
        <div class="modal fade" id="view_${data.id}" tabindex="-1" role="dialog" aria-labelledby="view_${data.id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${data.title}</h5>
                    </div>
                    <div class="modal-body">
                        <p>${data.content}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="edit_${data.id}"" tabindex="-1" role="dialog" aria-labelledby="edit_${data.id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${data.title}</h5>
                    </div>
                    <div class="modal-body">
                        <textarea id='update-note-text-${data.id}'>${data.content}</textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick="confirmUpdate(${data.id})">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delete_${data.id}" tabindex="-1" role="dialog" aria-labelledby="deleteNote-${data.id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Are you sure you want to delete this note?</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onClick="confirmDelete(${data.id})">Save changes</button>
                </div>
                </div>
            </div>
        </div>
    </div>
    `
}

// take data, if successful, delete from session!
const logout = () => {
    $.ajax({
        url: `${baseUrl}auth/logout`,
        headers: {'authorization': `Bearer ${sessionStorage.getItem('accessToken')}`},
        type: 'POST',
        data: {username: sessionStorage.getItem('username')},
        success: function (data) {
            if (data.success) {
                sessionStorage.clear()
            }
            window.location.pathname = '/'
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log({xhr, thrownError})
            alert(`${thrownError}: ${xhr.responseJSON.message}`);
        }
    })
}
// if no data, user not permitted, transfer to login page
$(document).ready(() => {
    const userId = sessionStorage.getItem('userId')
    const username = sessionStorage.getItem('username')
    const accessToken = sessionStorage.getItem('accessToken')
    if (!userId || !username || !accessToken) {
        window.location.pathname = '/handle_user'
    }
    fetchData()
})
