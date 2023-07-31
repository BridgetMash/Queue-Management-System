const form = document.getElementById('patient-form');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const dob = document.getElementById('dob');
const address = document.getElementById('address');
const phoneNumber = document.getElementById('phone-number');
const submitButton = document.getElementById('submit-button');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    const patient = {
        first_name: firstName.value,
        last_name: lastName.value,
        dob: dob.value,
        address: address.value,
        phone_number: phoneNumber.value
    };
    try {
        const response = await savePatient(patient);
        window.alert(`Patient ${response.first_name} ${response.last_name} has been saved with unique code ${response.unique_code} and queue position ${response.queue_position}`);
        form.reset();
    } catch (error) {
        console.error(error);
        window.alert('An error occurred while saving the patient');
    } finally {
        submitButton.disabled = false;
    }
});