document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const userTypeSelect = document.getElementById('userType');
    const studentFields = document.getElementById('studentFields');
    const professionalFields = document.getElementById('professionalFields');




    

form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(registrationForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        
        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
            });

            const data = await response.json();
         console.log(data);
 
        } catch (err) {
            console.error('Error:', err);
        }
    });


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

 