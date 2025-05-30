const coockiesTemplate = (link) => `
<div class="cookie">
<div class="container">
  <div class="cookie__inside">
    <div class="cookie__content">
      <p class="cookie__text">Мы используем cookie, чтобы сайтом было удобно пользоваться. Продолжая пользоваться сайтом, вы соглашаетесь на использование нами ваших файлов cookie. <a href="${link}" target="_blank"><span>Подробнее</span></a></p>
      <div class="cookie__btns">
        <a href="#" class="btn btn--rounded btn--black cookie__arr">
            <span>Хорошо</span>
        </a>
      </div>
    </div>
  </div>
</div>
</div>`;

export function setCookiesSession(link) {
    const isSession = Boolean(localStorage.getItem('yanina', 'read'));
    let cookieBlock;

    if (!isSession) {
        let promise = new Promise((resolve) => {
            cookieBlock = document.createElement('div');
            cookieBlock.innerHTML = coockiesTemplate(link);
            const footer = document.querySelector('footer');
            footer.after(cookieBlock);
            setTimeout(() => resolve(''), 0);
        }).then(() => {
            const cookieItem = document.querySelector('.cookie');
            const cookieAccept = cookieItem.querySelector('.cookie__arr');
            const closeBtn = cookieItem.querySelector('.cookie__close');

            const animationEndHandler = () => {
                cookieItem.classList.remove('move-left')
                cookieItem.removeEventListener("animationend", animationEndHandler);
                cookieItem.classList.add('hidden')
                cookieBlock.remove();
            };

            const closeHandler = (evt) => {
                evt.preventDefault();
                cookieAccept.removeEventListener('click', closeHandler);
                if (closeBtn) {
                    closeBtn.removeEventListener('click', closeHandler);
                }
                cookieItem.classList.add('move-left')
                cookieItem.addEventListener("animationend", animationEndHandler);
                localStorage.setItem('yanina', 'read')
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', closeHandler);
            }
            cookieAccept.addEventListener('click', closeHandler);
        });

    }
};