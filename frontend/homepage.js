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

// AllNotes button function
document.addEventListener('DOMContentLoaded', async () => {
    const allNotesLink = document.getElementById('allnotes-link')

    allNotesLink.addEventListener('click', async (event) => {
        event.preventDefault()

        try {
            const response = await fetch(`${API_URL}/userdata`, { method: 'GET' })

            if (response.ok) {
                window.location.href = '/dashboard'
            } else {
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('error checking user authentication:', error)
            window.location.href = '/login'
        }
    })

})

// MyNotes button function
document.addEventListener('DOMContentLoaded', async () => {
    const myNotesLink = document.getElementById('mynotes-link')

    myNotesLink.addEventListener('click', async (event) => {
        event.preventDefault()

        try {
            const response = await fetch(`${API_URL}/userdata`, { method: 'GET' })

            if (response.ok) {
                window.location.href = '/dashboard'
            } else {
                window.location.href = '/login'
            }
        } catch (error) {
            console.error('error checking user authentication:', error)
            window.location.href = '/login'
        }
    })

})