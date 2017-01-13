/**
 * Created by maiquel on 13/01/17.
 */

(function () {
	"use strict";


	let carousel = {
		imgs: document.getElementById('ld-slideshow').children,											// pega todos os imgs
		interval: 6000,
		currentSlide: 0,
		playEvent: "",
		init: function () {
			this.imgs[this.currentSlide].style.webkitAnimation = 'fadey ' + this.interval + 'ms';		// anima a primeira imagem
			this.imgs[this.currentSlide].style.animation = 'fadey ' + this.interval + 'ms';
			this.play();
		},

		nextSlide: function () {
			this.imgs[this.currentSlide].removeAttribute('style');										// remove o efeito da imagem atual
			if (this.currentSlide == this.imgs.length - 1) {											// se foi a última, volta pra primeira
				this.currentSlide = 0;
			}
			else {
				this.currentSlide++;																	// se não, avança a imagem
			}
			this.imgs[this.currentSlide].style.webkitAnimation = 'fadey ' + this.interval + 'ms';    	// adiciona efeito de animação na imagem atual
			this.imgs[this.currentSlide].style.animation = 'fadey ' + this.interval + 'ms';
		},

		setSlide: function (index) {
			this.stop();

			this.imgs[this.currentSlide].removeAttribute('style');
			if (index <= this.imgs.length - 1 && index >= 0) {
				this.currentSlide = index;
			}
			else {
				console.log("Invalid Carousel index");
				this.currentSlide = 0;
			}
			this.imgs[this.currentSlide].style.webkitAnimation = 'fadey ' + this.interval + 'ms';    	// adiciona efeito de animação na imagem atual
			this.imgs[this.currentSlide].style.animation = 'fadey ' + this.interval + 'ms';

			this.play();
		},

		play: function () {
			this.playEvent = setInterval(function () {
				carousel.nextSlide();
			}, carousel.interval);
		},

		stop: function () {
			if (this.playEvent) {
				clearInterval(this.playEvent);
				this.playEvent = null;
			}
		}
	};

	carousel.init();

	//simula um clique depois de 5 s
	setTimeout(function () {
		carousel.setSlide(5);
	}, 2000)


}());