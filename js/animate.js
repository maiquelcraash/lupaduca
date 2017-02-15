/**
 * Created by maiquel on 15/02/17.
 */

(function () {
	"use strict";

	let mq = window.matchMedia("(min-width: 768px)"),
		servicesSectionElement = document.getElementById("services"),
		body = document.body,
		html = document.documentElement;

	let pageHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);


	/* Animate elements on scroll */
	window.onscroll = () => {
		if (mq.matches) {										//check if window min width is 768px

			/* Calculates the amount of moviment considering the Y offset of the element */
			let yRel = Math.floor(((70 / servicesSectionElement.offsetTop) * window.pageYOffset) + 30);
			servicesSectionElement.style.marginBottom = "-" + yRel + "px";
		}
		else servicesSectionElement.style.removeProperty("marginBottom");
	};


	/* Remove animates when isnt a desktop device */
	window.addEventListener("resize", function () {
		if (!mq.matches) {
			servicesSectionElement.style.removeProperty("margin-bottom");
		}
	});

}());