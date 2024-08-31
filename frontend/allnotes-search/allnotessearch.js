// get API_URL from the environment
let API_URL = ''

async function fetchConfig() {
    try {
        const response = await fetch('/config')
        const config = await response.json()
        API_URL = config.apiUrl
    } catch (error) {
        console.error('Error fetching config:', error)
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
    };
    return new Intl.DateTimeFormat('en-CA', options).format(new Date(date))
}

// Function to render notes (used for both all notes and search results)
function renderNotes(notes) {
    const noteContainer = document.getElementById('note-cards-container')
    noteContainer.innerHTML = ''; // Clear any existing content

    if (notes.length) {
        notes.forEach(note => {
            const formattedDate = formatDate(note.datecreated)
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

            noteContainer.innerHTML += noteCard
        });

        // Add event listeners for "Read more" and "Read less"
        document.querySelectorAll('.read-more').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault()
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
        noteContainer.innerHTML = '<p class="text-center">No notes found.</p>'
    }
}

// Fetch search results
async function fetchSearchResults(searchTerm = '') {
    try {
        const response = await fetch(`${API_URL}/api/search?searchTerm=${searchTerm}`)
        const data = await response.json()
        renderNotes(data)
    } catch (error) {
        console.error('Error fetching search results:', error)
    }
}


// fetch the logged-in user's name
async function fetchUsername() {
    try {
        const response = await fetch(`${API_URL}/userdata`)
        if (response.ok) {
            const data = await response.json()
            return data.username;
        } else {
            throw new Error('Unable to fetch username')
        }
    } catch (error) {
        console.error('Error fetching username:', error)
    }
}

// Event listener for DOMContentLoaded
addEventListener('DOMContentLoaded', async () => {
    const username = await fetchUsername()

    if (username) {
        const greetingElement = document.getElementById('user-greeting')
        if (greetingElement) {
            greetingElement.innerHTML = `Hello, ${username}!`
        }
    }
    const urlParams = new URLSearchParams(window.location.search)
    const searchTerm = urlParams.get('searchTerm') || ''
    await fetchSearchResults(searchTerm)
})

// Logout functionality
document.getElementById('logout-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.ok) {
            window.location.href = '/login'
        }
    } catch (error) {
        console.error('Error logging out:', error)
    }
})
