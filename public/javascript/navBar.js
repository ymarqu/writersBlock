const hamburgerButton = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburgerButton.addEventListener('click', () => {
    navLinks.classList.toggle('expand');
});