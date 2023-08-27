document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-patient-form').addEventListener('submit', function (event) {
        event.preventDefault();
        let patient = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            phone_number: document.getElementById('phone-number').value,
            symptoms: document.getElementById('symptoms').value,
            temperature: document.getElementById('temperature').value
            
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
     // Cancel button event handler
     document.getElementById('cancel-button').addEventListener('click', function() {
        document.getElementById('first-name').value = '';
        document.getElementById('last-name').value = '';
        document.getElementById('dob').value = '';
        document.getElementById('address').value = '';
        document.getElementById('phone-number').value = '';
        document.getElementById('symptoms').value= '' ,
        document.getElementById('temperature').value= ''
                 
    });
});
 

