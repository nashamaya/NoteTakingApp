// Register form submit
document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault()

    const formData = new FormData(this)
    const username = formData.get('username')
    const password = formData.get('password')
    console.log(formData)
    console.log(username)

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        // display error message eg. username already exists
        const errorMessageDiv = document.getElementById('error-message')
        errorMessageDiv.classList.add('d-none')

        if (response.status === 409) {
            const data = await response.json()
            errorMessageDiv.textContent = data.message
            errorMessageDiv.classList.remove('d-none')

        } else if (response.status === 400 || response.status === 500) {
            const data = await response.json()
            errorMessageDiv.textContent = data.message
            errorMessageDiv.classList.remove('d-none')
        } else if (response.ok) {
            window.location.href = '/login'
        } else {
            console.error('Unexpected response status:', response.status)
        }
    } catch (error) {
        console.error('Error', error)
    }
})