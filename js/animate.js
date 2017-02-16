/**
 * Created by maiquel on 15/02/17.
 */

(function () {
	"use strict";

	let mq = window.matchMedia("(min-width: 768px)"),
		servicesSectionElement = document.getElementById("services"),
		body = document.body,
		html = document.documentElement,
		mainNav = document.getElementById("mainNav");

	let pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);


	/* Add Event that closes the menu when clicked on an option */
	let menuItems = document.querySelectorAll('#navbarResponsive>ul>li>a');
	menuItems.forEach((listItem) => {
		listItem.onclick = () => {
			document.getElementById("navbarResponsive").classList.remove("show");
		}
	});

	/* Animate elements on scroll */
	window.onscroll = () => {
		servicesWiggle();
		navbarShrink();
	};


	/* Remove animates when isnt a desktop device */
	window.addEventListener("resize", function () {
		if (!mq.matches) {
			servicesSectionElement.style.removeProperty("margin-bottom");
		}
	});


	/**
	 * Reduces the navbar when the users scrolls the page
	 */
	function navbarShrink() {
		if (window.pageYOffset > 100) {
			mainNav.classList.add("navbar-shrink");
		}
		else {
			mainNav.classList.remove("navbar-shrink");
		}
	}

	/**
	 * Animate the Services section with a smooth Y moviment while scrolling the page
	 */
	function servicesWiggle() {
		if (mq.matches) {										//check if window min width is 768px
			/* Calculates the amount of moviment considering the Y offset of the element */
			let yRel = Math.floor(((70 / servicesSectionElement.offsetTop) * window.pageYOffset) + 30);
			servicesSectionElement.style.marginBottom = "-" + yRel + "px";
		}
		else servicesSectionElement.style.removeProperty("marginBottom");
	}

}());