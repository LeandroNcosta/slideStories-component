import Slide from "./Slide.js"

const slideContainer = document.getElementById('slide')
const slides = document.querySelector('.slide-elements')
const controls = document.querySelector(".slide-controls")

// slides.children.length, caso tenha algo
if (slides && controls && slideContainer && slides.children.length) {
  const slide = new Slide(slideContainer, Array.from(slides.children), controls, 3000)
  slide.init()

}
