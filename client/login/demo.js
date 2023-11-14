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
        // Communicate with the React app to open the registration page
        window.parent.postMessage('signupButtonClicked', '*');
      });
    }
  });
