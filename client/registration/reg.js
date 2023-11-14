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

       const password=document.getElementById("pass");
       
       const confirmPassword=document.getElementById("confirmPass");
       const passwordError = document.getElementById('passwordError');
       if (password !== confirmPassword) {
        passwordError.textContent = 'Passwords do not match';
        return false;
    } else {
        passwordError.textContent = '';
        return true;
    }
       
    });
});