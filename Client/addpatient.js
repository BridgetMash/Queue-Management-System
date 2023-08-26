document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-patient-form').addEventListener('submit', function (event) {
        event.preventDefault();
        let patient = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            dob: document.getElementById('dob').value,
            address: document.getElementById('address').value,
            phone_number: document.getElementById('phone-number').value,
            policy_number: document.getElementById('policy-number').value,
            reason_for_visit: document.getElementById('reason-for-visit').value,
            allergies: document.getElementById('allergies').value,
            emergency_number: document.getElementById('emergency-number').value,
            gp: document.getElementById('gp').value,
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
        document.getElementById('policy-number').value= '' ,
        document.getElementById('reason-for-visit').value= '',
        document.getElementById('allergies').value= '',
        document.getElementById('emergency-number').value= '',
        document.getElementById('gp').value= ''
            
    });
});
 

