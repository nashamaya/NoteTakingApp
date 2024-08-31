// Initiate the login form and send the login request to the server
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        // if the login is successful, redirect to the dashboard page
        if (response.ok) {
            window.location.href = '/dashboard'
        // if the login is unsuccessful, display the error message eg. incorrect password or username does not exist
        } else {
            const data = await response.json()
            const errorMessageElement = document.getElementById('error-message')
            errorMessageElement.classList.remove('d-none')
            errorMessageElement.textContent = data.error
        }
    } catch (error) {
        console.error(error)
    }
})


