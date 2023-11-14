document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const userTypeSelect = document.getElementById('userType');
    const studentFields = document.getElementById('studentFields');
    const professionalFields = document.getElementById('professionalFields');

    userTypeSelect.addEventListener('change', function () {
        if (userTypeSelect.value === 'student') {
            studentFields.style.display = 'block';
            professionalFields.style.display = 'none';
        } else if (userTypeSelect.value === 'professional') {
            studentFields.style.display = 'none';
            professionalFields.style.display = 'block';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Your form submission logic goes here

        // Access form data using document.getElementById or other DOM methods
        // For example:
        // const firstName = document.getElementsByName('firstName')[0].value;
        // const lastName = document.getElementsByName('lastName')[0].value;
        // const email = document.getElementsByName('email')[0].value;
        // const password = document.getElementsByName('password')[0].value;
        // const confirmPassword = document.getElementsByName('confirmPassword')[0].value;
        // const country = document.getElementsByName('country')[0].value;
        // const city = document.getElementsByName('city')[0].value;
        // const userType = document.getElementById('userType').value;
        // const collegeName = document.getElementsByName('collegeName')[0].value;
        // const startingYear = document.getElementsByName('startingYear')[0].value;
        // const endingYear = document.getElementsByName('endingYear')[0].value;
        // const companyName = document.getElementsByName('companyName')[0].value;
        // const position = document.getElementsByName('position')[0].value;
        // const profStartingYear = document.getElementsByName('profStartingYear')[0].value;
        // const profEndingYear = document.getElementsByName('profEndingYear')[0].value;

        // Perform any necessary validation and submission
    });
});