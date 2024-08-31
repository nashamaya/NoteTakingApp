// Get API URL from the environment
let API_URL = ''

async function fetchConfig() {
    try {
        const response = await fetch('/config')
        const config = await response.json()
        API_URL = config.apiUrl;
    } catch (error) {
        console.error('Error fetching config:', error)
    }
}

// set up for the pagination
const NOTES_PER_PAGE = 6
let currentPage = 1
let notesData = []

// Fetch all notes from the logged-in user
async function fetchAlldata() {
    try {
        const response = await fetch(`${API_URL}/api/mynotes`)
        console.log(response)
        const data = await response.json()

        notesData = data
        setupPagination(notesData.length)   // Setup pagination based on the number of notes
        displayPage(currentPage)
    } catch (error) {
        console.error('error fetching data:', error)
    }
}

// Format the date to be displayed in the card and easy to read, use Vancouver time
function formatDate(date) {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,  // 24-hour format
        timeZone: 'America/Vancouver'  // Vancouver time
    };
    return new Intl.DateTimeFormat('en-CA', options).format(new Date(date))
}

// Display the notes on the page in cards
async function displayPage(page) {

    const startIndex = (page - 1) * NOTES_PER_PAGE
    const endIndex = startIndex + NOTES_PER_PAGE
    const notesToShow = notesData.slice(startIndex, endIndex)

    const noteContainer = document.getElementById('note-cards-container')
    noteContainer.innerHTML = ''; // Clear any existing content

    if (notesToShow.length) {
        notesToShow.forEach(note => {
            const formattedDate = formatDate(note.datecreated)
            let noteCard = ''

            // Note is longer than 100 characters, add "Read more", add "edit" and "delete" buttons to the card - only for MyNotes page so users can edit and delete their own notes  
            if (note.notecontent.length > 100) {
                noteCard = `
                        <div class="col">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${note.notesubject}</h5>
                                    <p class="card-text">
                                        <span class="short-content">${note.notecontent.substring(0, 100)}.....</span>
                                        <span class="full-content d-none">${note.notecontent}</span>
                                        <a href="#" class="read-more">Read more</a>
                                    </p>
                                    <div class="d-flex justify-content-between">
                                        <span class="badge rounded-pill border border-info text-dark">${formattedDate}</span>
                                        <span class="badge rounded-pill text-bg-warning">${note.noteauthor}</span>
                                    </div>      
                                    <br>

                                    <div class="d-flex justify-content-center">
                            
                                    <button 
                                        class="btn btn-success edit-button mx-2 btn-sm" 
                                        data-note-id="${note._id}" 
                                        data-note-subject="${note.notesubject}" 
                                        data-note-content="${note.notecontent}" 
                                        data-note-author="${note.noteauthor}">
                                        Edit
                                    </button>
                                    <button 
                                         class="btn btn-danger delete-button mx-2 btn-sm" 
                                         data-note-id="${note._id}">
                                         Delete
                                    </button>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    `;
            } else {
                // Note is 100 characters or less, no "Read more" needed
                noteCard = `
                        <div class="col">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${note.notesubject}</h5>
                                    <p class="card-text">${note.notecontent}</p>
                                    <div class="d-flex justify-content-between">
                                        <span class="badge rounded-pill border border-info text-dark">${formattedDate}</span>
                                        <span class="badge rounded-pill text-bg-warning">${note.noteauthor}</span>
                                    </div>  
                                     <br>

                                    <div class="d-flex justify-content-center">
                            
                                    <button 
                                        class="btn btn-success edit-button mx-2 btn-sm" 
                                        data-note-id="${note._id}" 
                                        data-note-subject="${note.notesubject}" 
                                        data-note-content="${note.notecontent}" 
                                        data-note-author="${note.noteauthor}">
                                        Edit
                                    </button>
                                    <button 
                                         class="btn btn-danger delete-button mx-2 btn-sm" 
                                         data-note-id="${note._id}">
                                         Delete
                                    </button>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    `;
            }

            noteContainer.innerHTML += noteCard
        })
        // Add event listeners for "Read more" and "Read less"
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const cardText = event.target.closest('.card-text')
                const shortContent = cardText.querySelector('.short-content')
                const fullContent = cardText.querySelector('.full-content')
                const isExpanded = fullContent.classList.contains('d-none')

                if (isExpanded) {
                    // Expand to show full content
                    shortContent.classList.add('d-none')
                    fullContent.classList.remove('d-none')
                    event.target.textContent = 'Read less'
                } else {
                    // Collapse to show short content
                    shortContent.classList.remove('d-none')
                    fullContent.classList.add('d-none')
                    event.target.textContent = 'Read more'
                }
            })
        })
    } else {
        noteContainer.innerHTML = `<p class="text-center">No notes found from ${await fetchUsername()}.</p>`
    }
}

// Setup the pagination. One page has 6 notes. If there are more than 6 notes, show pagination to the next page 
function setupPagination(totalNotes) {
    const totalPages = Math.ceil(totalNotes / NOTES_PER_PAGE)
    const paginationContainer = document.querySelector('.pagination')
    paginationContainer.innerHTML = ''

    if (totalPages > 1) {
        const createPageItem = (pageNum, label = pageNum) => {
            return `
            <li class="page-item ${pageNum === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${pageNum}">${label}</a>
                    </li>
                `}

        paginationContainer.innerHTML += createPageItem(currentPage > 1 ? currentPage - 1 : 1, 'Previous')

        for (let i = 1; i <= totalPages; i++) {
            paginationContainer.innerHTML += createPageItem(i)
        }

        paginationContainer.innerHTML += createPageItem(currentPage < totalPages ? currentPage + 1 : totalPages, 'Next')

        // Add event listeners for pagination
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault()
                const page = parseInt(event.target.getAttribute('data-page'))
                if (!isNaN(page)) {
                    currentPage = page
                    displayPage(currentPage)
                    setupPagination(notesData.length)
                }
            })
        })
    }
}

// Fetch the username of the logged-in user and display a greeting message
async function fetchUsername() {
    try {
        const response = await fetch(`${API_URL}/userdata`)
        if (response.ok) {
            const data = await response.json()
            return data.username
        } else {
            throw new Error('unable to fetch username')
        }
    } catch (error) {
        console.error('error fetching username:', error)
    }
}

addEventListener('DOMContentLoaded', async () => {
    const username = await fetchUsername()

    if (username) {

        const greetingElement = document.getElementById('user-greeting')
        if (greetingElement) {
            greetingElement.innerHTML = `Hello, ${username}!`
        }
    }
    await fetchAlldata()
})

// Add new notes
document.getElementById('add-note').addEventListener('submit', async (event) => {
    event.preventDefault() // prevent the form to go to another page

    const noteSubject = document.getElementById('note-subject')
    const noteContent = document.getElementById('note-content')
    const username = await fetchUsername()

    try {
        await fetch(`${API_URL}/api/mynotes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notesubject: noteSubject.value,
                notecontent: noteContent.value,
                noteauthor: username
            })
        })

    } catch (error) {
        console.error('error adding note:', error)
    } finally {
        await fetchAlldata()
        noteSubject.value = ''
        noteContent.value = ''
    }
})


// Event listener for the edit button

let currentNoteId = null;
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-button')) {
        event.preventDefault()

        // Get the note details
        const noteId = event.target.getAttribute('data-note-id');
        const noteSubject = event.target.getAttribute('data-note-subject')
        const noteContent = event.target.getAttribute('data-note-content')

        // Set the modal input fields with the current note details
        document.getElementById('edit-note-subject').value = noteSubject
        document.getElementById('edit-note-content').value = noteContent


        // Store the current note ID for later use
        currentNoteId = noteId

        // Show the modal
        const editNoteModal = new bootstrap.Modal(document.getElementById('editNoteModal'))
        editNoteModal.show();
    }
});

// Event listener for the "Save" button inside the modal
document.getElementById('save-edit-button').addEventListener('click', async () => {
    const noteSubject = document.getElementById('edit-note-subject').value
    const noteContent = document.getElementById('edit-note-content').value
    const username = await fetchUsername()

    try {
        await fetch(`${API_URL}/api/mynotes/${currentNoteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                notesubject: noteSubject,
                notecontent: noteContent,
                noteauthor: username
            })
        })

        // Hide the modal after saving
        const editNoteModal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'))
        editNoteModal.hide();

    } catch (error) {
        console.error('Error updating the note:', error)
    } finally {
        await fetchAlldata();

        // Reset the input fields
        document.getElementById('edit-note-subject').value = ''
        document.getElementById('edit-note-content').value = ''
    }
});

// Delete button

document.addEventListener('click', async (event) => {

    if (event.target.classList.contains('delete-button')) {
        const noteId = event.target.getAttribute('data-note-id')
        if (noteId) {
            try {
                await fetch(`${API_URL}/api/mynotes/${noteId}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error('error deleting note:', error)
            } 
            finally {
                await fetchAlldata()
            }
        }
        if (!noteId) {
            console.error('No note ID provided')
        }
    }
})

// Logout button
document.getElementById('logout-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            window.location.href = '/login'
        }
    } catch (error) {
        console.error('error logging out:', error)
    }
})