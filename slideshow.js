
let slideIndex = 1;

showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let newIndex;
  
  //let slides = document.getElementsByClassName("mySlides");
  let slides = document.getElementsByClassName("myslides");
  console.log(slides.length)
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {newIndex = 1}
  if (n < 1) {newIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  slides[newIndex-1].style.display = "block";
  dots[newIndex-1].className += " active";
} 