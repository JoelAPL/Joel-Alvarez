
/*==================== MUESTRAME EL MENU ====================*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)
    
// Validar que existan variables
    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            // Agregamos la clase show-menu a la etiqueta div con la clase nav__menu
            nav.classList.toggle('show-menu')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== QUITAR EL MENU MOVIL ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // Cuando hacemos clic en cada nav__link, eliminamos la clase show-menu
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL QUE ACTIVA EL LINK DE MODO OSCURO  ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CAMBIAR TÍTULO DE FONDO ===================*/ 
function scrollHeader(){
    const nav = document.getElementById('header')
    // Cuando el desplazamiento es mayor que 200 de altura de ventana gráfica, agregue la clase de encabezado de desplazamiento a la etiqueta del encabezado
    if(this.scrollY >= 200) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== MOSTRAR PARTE SUPERIOR DEL DESPLAZAMIENTO ====================*/ 
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top');
    // Cuando el desplazamiento es superior a la altura de la ventana gráfica 560, agregue la clase show-scroll a la etiqueta a con la clase scroll-top
    if(this.scrollY >= 560) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*==================== TEMA DE LUZ OSCURA ====================*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-toggle-right'

//Tema previamente seleccionado (si el usuario lo seleccionó)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Obtenemos el tema actual que tiene la interfaz validando la clase dark-theme
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-toggle-left' : 'bx-toggle-right'

// Validamos si el usuario eligió previamente un tema
if (selectedTheme) {
  // Si se cumple la validación, preguntamos cuál fue el problema para saber si activamos o desactivamos la oscuridad
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-toggle-left' ? 'add' : 'remove'](iconTheme)
}

// Activar/desactivar el tema manualmente con el botón
themeButton.addEventListener('click', () => {
    // Agregar o eliminar el tema oscuro/icono
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // Guardamos el tema y el icono actual que eligió el usuario
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

//ANIMACION SWIPER
 var swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
      });

//ANIMACIÓN DE REVELACIÓN DE DESPLAZAMIENTO 
const sr = ScrollReveal({
    distance: '30px',
    duration: 1800,
    reset: true,
});

sr.reveal(`.inicio__data, .inicio__img, 
           .habilidades__data,
           .works__img-overlay,
           .crud__data, 
           .accessory__content,
           .footer__content`, {
    origin: 'top',
    interval: 200,
})

sr.reveal(`.acerca__img, .send__content, .works__data, .swiper-wrapper`, {
    origin: 'left'
})

sr.reveal(`.acerca__data, .send__img, .crud__img`, {
    origin: 'right'
})


let xPos = 0;

gsap.timeline()
    .set('.workring', { rotationY:180, cursor:'grab' }) //set initial rotationY so the parallax jump happens off screen
    .set('.workimg',  { // apply transform rotations to each image
      rotateY: (i)=> i*-36,
      transformOrigin: '50% 50% 500px',
      z: -500,
      backgroundImage:(i)=>'url(https://picsum.photos/id/'+(i+32)+'/600/400/)',
      backgroundPosition:(i)=>getBgPos(i),
      backfaceVisibility:'hidden'
    })    
    .from('.workimg', {
      duration:1.5,
      y:200,
      opacity:0,
      stagger:0.1,
      ease:'expo'
    })
    .add(()=>{
      $('.workimg').on('mouseenter', (e)=>{
        let current = e.currentTarget;
        gsap.to('.workimg', {opacity:(i,t)=>(t==current)? 1:0.5, ease:'power3'})
      })
      $('.workimg').on('mouseleave', (e)=>{
        gsap.to('.workimg', {opacity:1, ease:'power2.inOut'})
      })
    }, '-=0.5')

$(window).on('mousedown touchstart', dragStart);
$(window).on('mouseup touchend', dragEnd);
      

function dragStart(e){ 
  if (e.touches) e.clientX = e.touches[0].clientX;
  xPos = Math.round(e.clientX);
  gsap.set('.workring', {cursor:'grabbing'})
  $(window).on('mousemove touchmove', drag);
}


function drag(e){
  if (e.touches) e.clientX = e.touches[0].clientX;    

  gsap.to('.workring', {
    rotationY: '-=' +( (Math.round(e.clientX)-xPos)%360 ),
    onUpdate:()=>{ gsap.set('.workimg', { backgroundPosition:(i)=>getBgPos(i) }) }
  });
  
  xPos = Math.round(e.clientX);
}


function dragEnd(e){
  $(window).off('mousemove touchmove', drag);
  gsap.set('.workring', {cursor:'grab'});
}


function getBgPos(i){ //returns the background-position string to create parallax movement in each image
  return ( 100-gsap.utils.wrap(0,360,gsap.getProperty('.working', 'rotationY')-180-i*36)/360*500 )+'px 0px';
}