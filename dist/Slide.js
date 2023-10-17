import TimeOut from "./Timeout.js";
export default class Slide {
    container;
    slides;
    constrols;
    time;
    index;
    timeOut;
    paused;
    pausedTimeOut;
    thumbItems;
    constructor(container, slides, controls, time = 3000) {
        this.container = container;
        this.slides = slides;
        this.constrols = controls;
        this.time = time;
        this.timeOut = null;
        this.index = localStorage.getItem('activeSlide') ? Number(localStorage.getItem('activeSlide')) : 0;
        this.thumbItems = null;
        this.paused = false;
        this.pausedTimeOut = null;
    }
    auto(time) {
        this.timeOut?.clear();
        this.timeOut = new TimeOut(() => this.next(), time);
        if (this.time && this.thumbItems)
            this.thumbItems[this.index].style.animationDuration = `${time}ms`;
    }
    pause() {
        const slideAtual = this.slides[this.index];
        this.pausedTimeOut = new TimeOut(() => {
            this.timeOut?.pause();
            this.paused = true;
            if (slideAtual instanceof HTMLVideoElement) {
                slideAtual.pause();
            }
            if (this.thumbItems && this.thumbItems.length)
                this.thumbItems[this.index].classList.add('paused');
            document.body.classList.add(`paused`);
        }, 300);
    }
    continue() {
        const slideAtual = this.slides[this.index];
        this.pausedTimeOut?.clear();
        if (this.paused) {
            this.paused = false;
            this.timeOut?.continue();
            if (slideAtual instanceof HTMLVideoElement)
                slideAtual.play();
        }
        if (this.thumbItems && this.thumbItems.length)
            this.thumbItems[this.index].classList.remove('paused');
        document.body.classList.remove(`paused`);
    }
    hide(el) {
        el.classList.remove('active');
        if (el instanceof HTMLVideoElement) {
            el.currentTime = 0;
            el.pause();
        }
    }
    show() {
        this.slides.forEach(el => this.hide(el));
        localStorage.setItem('activeSlide', String(this.index));
        this.slides[this.index].classList.add('active');
        const slideAtual = this.slides[this.index];
        if (slideAtual instanceof HTMLVideoElement) {
            this.autovideo(slideAtual);
        }
        else {
            this.auto(this.time);
        }
        if (this.thumbItems) {
            this.thumbItems.forEach(el => el.classList.remove('active'));
            this.thumbItems[this.index].classList.add('active');
        }
    }
    prev() {
        if (this.paused)
            return;
        const maximumSlideSize = this.slides.length - 1;
        this.index = this.index <= 0 ? maximumSlideSize : this.index - 1;
        this.show();
    }
    next() {
        const maximumSlideSize = this.slides.length - 1;
        if (this.paused)
            return;
        if (this.thumbItems && this.index >= maximumSlideSize) {
            this.thumbItems.forEach(el => el.classList.remove('active'));
        }
        this.index = this.index >= maximumSlideSize ? 0 : this.index + 1;
        this.show();
    }
    addControls() {
        const prevButton = document.createElement('button');
        const nextButton = document.createElement('button');
        prevButton.textContent = 'Slide anterior';
        nextButton.textContent = 'Próximo slide';
        this.constrols.append(prevButton, nextButton);
        this.constrols.addEventListener("pointerdown", () => this.pause());
        document.addEventListener("pointerup", () => this.continue());
        document.addEventListener("touchend", () => this.continue());
        prevButton.addEventListener('pointerup', () => this.prev());
        nextButton.addEventListener('pointerup', () => this.next());
    }
    addThumbItems() {
        const thumbContainer = document.createElement('div');
        thumbContainer.id = 'slide-thumb';
        this.slides.forEach(item => thumbContainer.innerHTML += `<span><span class="thumb-item" ></span></span>`);
        this.constrols.appendChild(thumbContainer);
        this.thumbItems = Array.from(document.querySelectorAll('.thumb-item'));
    }
    autovideo(video) {
        video.muted = true;
        video.play();
        let firstPlay = true;
        video.addEventListener('playing', () => {
            const duration = video.duration * 1000;
            if (firstPlay)
                this.auto(duration);
            firstPlay = false;
        });
    }
    init() {
        this.addControls();
        this.addThumbItems();
        this.show();
        this.auto(this.time);
    }
}
//# sourceMappingURL=Slide.js.map