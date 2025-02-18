document.addEventListener("DOMContentLoaded", function() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu");
  const headerTop = document.querySelector(".header-top");
  const body = document.body;
  const links = document.querySelectorAll(".menu-item a");
  const overlay = document.getElementById("overlay");

  burger.addEventListener("click", function(event) {
    event.stopPropagation();
    headerTop.classList.toggle("open");

    if (headerTop.classList.contains("open")) {
      body.classList.add("no-scroll");
      overlay.style.opacity = "1";
      overlay.style.visibility = "visible";
    } else {
      body.classList.remove("no-scroll");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";
    }
  });

  menu.addEventListener("click", function(event) {
    event.stopPropagation();
  });

  links.forEach(function(link) {
    link.addEventListener("click", function(event) {
      event.preventDefault(); 

      headerTop.classList.remove("open");
      body.classList.remove("no-scroll");
      overlay.style.opacity = "0";
      overlay.style.visibility = "hidden";

      setTimeout(function() {
        window.location.href = link.getAttribute("href"); 
      }, 300); 
    });
  });

  overlay.addEventListener("click", function() {
    headerTop.classList.remove("open");
    body.classList.remove("no-scroll");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  });

  document.body.addEventListener("click", function() {
    headerTop.classList.remove("open");
    body.classList.remove("no-scroll");
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  });
});


