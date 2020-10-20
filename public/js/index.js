'use strict'

var menuBtn = document.getElementById("menuBtn");
var sideNav = document.getElementById("sideNav");

sideNav.style.right == "-250px";

menuBtn.onclick = ()=>{
    if ( sideNav.style.right == "-250px") {
        sideNav.style.right = "0";
    }else{
        sideNav.style.right = "-250px";
    }
}

var scroll = new SmoothScroll('a[href*="#"]', {
	speed: 300,
	speedAsDuration: true
});

