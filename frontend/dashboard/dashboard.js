// get API_URL from the environment
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

// setup the pagination
const NOTES_PER_PAGE = 6
let currentPage = 1
let notesData = []

// fetch all notes from the database
async function fetchAlldata() {
    try {
        const response = await fetch(`${API_URL}/api/allnotes`)
        console.log(response)
        const data = await response.json()

        notesData = data
        setupPagination(notesData.length)   // Setup pagination based on the number of notes
        displayPage(currentPage)
    } catch (error) {
        console.error('error fetching data:', error)
    }
}

// Format the date to display in the card and easy to read, use Vancouver time
function formatDate(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,  // 24-hour format
        timeZone: 'America/Vancouver'  // Vancouver time
    }
    return new Intl.DateTimeFormat('en-CA', options).format(new Date(date))
}

// Display all the notes on the page on cards depending on the number of notes
function displayPage(page) {

    const startIndex = (page - 1) * NOTES_PER_PAGE
    const endIndex = startIndex + NOTES_PER_PAGE
    const notesToShow = notesData.slice(startIndex, endIndex)

    const noteContainer = document.getElementById('note-cards-container')
    noteContainer.innerHTML = ''; // Clear any existing content

    if (notesToShow.length) {
        notesToShow.forEach(note => {

            const formattedDate = formatDate(note.datecreated)  // Format the date for each note
            let noteCard = ''

            if (note.notecontent.length > 100) {
                // Note is longer than 100 characters, add "Read more"
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
                                </div>
                            </div>
                        </div>
                    `;
            }

            noteContainer.innerHTML += noteCard;
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
            });
        });
    } else {
        noteContainer.innerHTML = '<p class="text-center">No notes available.</p>'
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

// Fetch the username and display it in the greeting message
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
        await fetch(`${API_URL}/api/allnotes`, {
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