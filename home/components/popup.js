const popup = document.getElementById('contactPopup');
const openBtns = document.querySelectorAll('.openPopupBtn');
const closeBtn = document.querySelector('.close-popup');
const cancelBtn = document.querySelector('.btn-cancel');

openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        popup.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    popup.classList.remove('active');
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('active');
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});