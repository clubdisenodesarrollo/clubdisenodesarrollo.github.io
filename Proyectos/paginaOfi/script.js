const openModal = document.querySelector('.hero__cta');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close');

openModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.add('modal--show');

});

closeModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.remove('modal--show');

});



const iframe = document.querySelector('iframe');

iframe.addEventListener('click', (event) => {
  event.preventDefault(); // Evita el comportamiento de clic predeterminado
});
