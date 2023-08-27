document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let staffId = document.getElementById('staff-id').value;
    let password = document.getElementById('password').value;

    fetch('http://localhost:3003/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ staffId, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                // Redirect to the registration or handle successful login
                window.location.href = '/register.html';
            } else {
                alert('Invalid login credentials.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});