document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-patient-form').addEventListener('submit', function (event) {
        event.preventDefault();
        let patient = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            phone_number: document.getElementById('phone-number').value
        };

        fetch('http://localhost:3003/addpatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patient),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the server response
                alert(`Your unique number is ` + data.unique_number);
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred.');
            });
    });
});