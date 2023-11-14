document.addEventListener("mousemove",(e) =>{
    const layer= document.getElementById("parallax-layer");
    const centerX = layer.clientWidth /2;
    const centerY = layer.clientHeight/2;
    const moveX= (centerX  -e.clientX)/30;
    const moveY= (centerY- e.clientY)/30;
    layer.style.transform=`translate(${moveX}px, ${moveY}px)`;
});
// window.addEventListener('scroll', function() {
//     var scrollPosition = window.scrollY;
//     document.getElementById('parallax-layer').style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
// });
