document.addEventListener("mousemove",(e) =>{
    const layer= document.getElementById("parallax-layer");
    const centerX = layer.clientWidth /2;
    const centerY = layer.clientHeight/2;
    const moveX= (centerX  -e.clientX)/30;
    const moveY= (centerY- e.clientY)/30;
    layer.style.transform=`translate(${moveX}px, ${moveY}px)`;
});
document.addEventListener('DOMContentLoaded', function () {
    const signupButton = document.getElementById('signupButton');

    if (signupButton) {
      signupButton.addEventListener('click', function () {
       
        window.parent.postMessage('signupButtonClicked', '*');
      });
    }
  });



  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Make AJAX request to the backend
        try {
            const res = await fetch('http://localhost:8000//auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

             
            if (res.ok) {
                console.log('Login successful');
            } else {
 
                console.error('Login failed:', data.message);
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
});