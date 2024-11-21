// JavaScript para manejar el clic en el área principal y mostrar u ocultar el menú desplegable
document.addEventListener("DOMContentLoaded", function() {
    var mainAreas = document.querySelectorAll(".main-area");
    mainAreas.forEach(function(mainArea) {
        mainArea.addEventListener("click", function() {
            var submenu = this.querySelector(".submenu");
            submenu.classList.toggle("show");
            this.classList.toggle("active");
        });
    });


    // Manejar el clic en el elemento home
    var home = document.getElementById("home");
    home.addEventListener("click", function(){
        this.classList.toggle("active");
    });

   
});


