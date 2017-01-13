/**
 * Created by maiquel on 13/01/17.
 */

(function () {
	"use strict";

	var imgs = document.getElementById('slideshow').children;					// pega todos os imgs
	var interval = 4000;														// duração do efeito
	var currentPic = 0;
	imgs[currentPic].style.webkitAnimation = 'fadey ' + interval + 'ms';		// anima a primeira imagem
	imgs[currentPic].style.animation = 'fadey ' + interval + 'ms';
	var infiniteLoop = setInterval(function () {								// loo infinito
		imgs[currentPic].removeAttribute('style');								// remove o efeito da imagem atual
		if (currentPic == imgs.length - 1) {									// se foi a última, volta pra primeira
			currentPic = 0;
		} else {
			currentPic++;														// se não, avança a imagem
		}
		imgs[currentPic].style.webkitAnimation = 'fadey ' + interval + 'ms';    // adiciona efeito de animação na imagem atual
		imgs[currentPic].style.animation = 'fadey ' + interval + 'ms';
	}, interval);


}());