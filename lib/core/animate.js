"use strict";

/**
 * Created by maiquel on 15/02/17.
 */

(function () {
	"use strict";

	var mq = window.matchMedia("(min-width: 768px)"),
	    servicesSectionElement = document.getElementById("services"),
	    body = document.body,
	    html = document.documentElement,
	    mainNav = document.getElementById("mainNav");

	var pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

	/* Add Event that closes the menu when clicked on an option */
	var menuItems = document.querySelectorAll('#navbarResponsive>ul>li>a');
	menuItems.forEach(function (listItem) {
		listItem.onclick = function () {
			document.getElementById("navbarResponsive").classList.remove("show");
		};
	});

	/* Animate elements on scroll */
	window.onscroll = function () {
		servicesWiggle();
		navbarShrink();
	};

	/* Remove animates when isnt a desktop device */
	window.addEventListener("resize", function () {
		if (!mq.matches) {
			servicesSectionElement.style.removeProperty("margin-bottom");
		}
	});

	$(function () {
		// document.getElementById('carouselExampleIndicators').carousel();
		$('carouselExampleIndicators').carousel({
			interval: 2000
		});

		$('.carousel-control.next').trigger('click');
	});

	/**
  * Reduces the navbar when the users scrolls the page
  */
	function navbarShrink() {
		if (window.pageYOffset > 100) {
			mainNav.classList.add("navbar-shrink");
		} else {
			mainNav.classList.remove("navbar-shrink");
		}
	}

	/**
  * Animate the Services section with a smooth Y moviment while scrolling the page
  */
	function servicesWiggle() {
		if (mq.matches) {
			//check if window min width is 768px
			/* Calculates the amount of moviment considering the Y offset of the element */
			var yRel = Math.floor(70 / servicesSectionElement.offsetTop * window.pageYOffset + 30);
			servicesSectionElement.style.marginBottom = "-" + yRel + "px";
		} else servicesSectionElement.style.removeProperty("marginBottom");
	}
})();