// objeto con las propiedades del efecto lightbox
var propLightbox = {

	imgContainer: document.getElementsByClassName('lightbox'),
	image: null
}

// objeto con los Metodos del efecto lightbox
var metLightbox = {
	inicio: function(){
		for (var i = 0; i < propLightbox.imgContainer.length; i++) {
			propLightbox.imgContainer[i].addEventListener('click', metLightbox.capturaImagen)
		}
		
	},

	capturaImagen: function(){
		propLightbox.imagen = this;
		metLightbox.lightbox(propLightbox.imagen);
	}
}

metLightbox.inicio();