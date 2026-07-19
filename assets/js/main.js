/*=============== MENÚ MÓVIL ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'))
navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'))
document.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () => navMenu.classList.remove('show-menu'))
)

/*=============== HEADER CON SCROLL ===============*/
const header = document.getElementById('header')
const scrollTopBtn = document.getElementById('scroll-top')

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40)
    scrollTopBtn.classList.toggle('show-scroll', window.scrollY > 560)
}, { passive: true })

/*=============== LINK ACTIVO POR SECCIÓN ===============*/
const sections = document.querySelectorAll('section[id]')

const linkObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const link = document.querySelector(`.nav__menu a[href="#${entry.target.id}"]`)
        if (!link) return
        if (entry.isIntersecting) {
            document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active-link'))
            link.classList.add('active-link')
        }
    })
}, { rootMargin: '-40% 0px -55% 0px' })

sections.forEach(section => linkObserver.observe(section))

/*=============== TEMA CLARO / OSCURO ===============*/
const themeButton = document.getElementById('theme-button')
const themeIcon = themeButton.querySelector('i')
const lightTheme = 'light-theme'

const applyTheme = theme => {
    document.body.classList.toggle(lightTheme, theme === 'light')
    themeIcon.className = theme === 'light' ? 'bx bx-moon' : 'bx bx-sun'
}

applyTheme(localStorage.getItem('selected-theme') || 'dark')

themeButton.addEventListener('click', () => {
    const next = document.body.classList.contains(lightTheme) ? 'dark' : 'light'
    applyTheme(next)
    localStorage.setItem('selected-theme', next)
})

/*=============== ANIMACIÓN REVEAL ===============*/
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            revealObserver.unobserve(entry.target)
        }
    })
}, { threshold: .15 })

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

/*=============== CARRUSEL DE PROYECTOS ===============*/
new Swiper('.proyectos__swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    coverflowEffect: {
        rotate: 35,
        stretch: 0,
        depth: 120,
        modifier: 1,
        slideShadows: false
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
})

/*=============== WIDGET DE JUEGOS: PESTAÑAS ===============*/
const gameTabs = document.querySelectorAll('.widget__tab')
const gamePanels = document.querySelectorAll('.widget__panel')

gameTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        gameTabs.forEach(t => {
            t.classList.toggle('active', t === tab)
            t.setAttribute('aria-selected', t === tab)
        })
        gamePanels.forEach(p => p.hidden = p.id !== tab.dataset.panel)
        if (tab.dataset.panel !== 'panel-bugs') bugsReset()
    })
})

/*=============== JUEGO 1: TERMINAL ===============*/
const termBody = document.getElementById('term-body')
const termInput = document.getElementById('term-input')
const termInputRow = termInput.closest('.term__line')

const TERM_CMDS = {
    help: `Comandos disponibles:
  <b>sobre-mi</b>    quién soy
  <b>proyectos</b>   en qué he trabajado
  <b>skills</b>      tecnologías que manejo
  <b>contacto</b>    dónde encontrarme
  <b>cv</b>          descargar mi CV
  <b>clear</b>       limpiar la consola`,
    'sobre-mi': `Soy <b>Joel Álvarez</b> (JoelAPL), desarrollador full-stack de Panamá 🇵🇦
5+ años de experiencia · ciberseguridad y sector bancario.
Estudiante de Desarrollo de Software en la UTP.
<i>"Si se puede imaginar, se puede programar."</i>`,
    proyectos: `→ <b>Conecta</b> — gestión de miembros y grupos
→ <b>Rig Program</b> — administración financiera
→ <b>Matriz de Riesgo</b> — análisis de riesgos
→ <b>JalproOne</b> — facturación electrónica
Baja a la sección <b>Proyectos</b> para verlos 👇`,
    skills: `[<span class="ok">██████████</span>] PHP · JavaScript · SQL
[<span class="ok">█████████░</span>] Symfony · Drupal · HTML · CSS
[<span class="ok">███████░░░</span>] React · Java · Python · Mixpanel`,
    contacto: `📧 joel.ale.programmer@gmail.com
🐙 <a href="https://github.com/JoelAPL" target="_blank" rel="noopener">github.com/JoelAPL</a>
💼 <a href="https://www.linkedin.com/in/joel-alvarez-72a047235/" target="_blank" rel="noopener">LinkedIn</a>
💬 <a href="https://api.whatsapp.com/send?l=es&phone=50764365433" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>`,
    cv: `Descargando <b>Joel-Alvarez-CV.pdf</b>… 📄`,
    sudo: `Buen intento 😏 pero aquí no hay root.`,
    hola: `¡Hola! 👋 Gracias por la visita.`,
}

const termPrint = (html, cls = 'out') => {
    const div = document.createElement('div')
    div.className = `term__line ${cls}`
    div.innerHTML = html
    termBody.insertBefore(div, termInputRow)
}

termInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return
    const cmd = termInput.value.trim().toLowerCase()
    termInput.value = ''
    if (!cmd) return
    termPrint(`<span class="prompt">joelapl@portfolio:~$</span> ${cmd.replace(/</g, '&lt;')}`)
    if (cmd === 'clear') {
        termBody.querySelectorAll('.term__line:not(.term__input-row)').forEach(el => el.remove())
    } else {
        termPrint(TERM_CMDS[cmd] || `bash: <b>${cmd.replace(/</g, '&lt;')}</b>: comando no encontrado. Prueba <b>help</b>.`)
        if (cmd === 'cv') {
            const link = document.createElement('a')
            link.href = 'assets/Joel-Alvarez-CV.pdf'
            link.download = 'Joel-Alvarez-CV.pdf'
            link.click()
        }
    }
    termBody.scrollTop = termBody.scrollHeight
})

termBody.addEventListener('click', () => termInput.focus())

/*=============== JUEGO 2: CAZA-BUGS ===============*/
const bugsArea = document.getElementById('bugs-area')
const bugsOverlay = document.getElementById('bugs-overlay')
const bugsStart = document.getElementById('bugs-start')
const bugsTimeEl = document.getElementById('bugs-time')
const bugsScoreEl = document.getElementById('bugs-score')
const bugsRecordEl = document.getElementById('bugs-record')

let bugsScore = 0, bugsTime = 30, bugsTimer = null, bugsSpawner = null
let bugsRecord = +localStorage.getItem('bugs-record') || 0
bugsRecordEl.textContent = bugsRecord

const bugsSpawn = () => {
    const bug = document.createElement('span')
    const roll = Math.random()
    bug.className = 'bug'
    bug.dataset.value = roll < .12 ? -5 : roll < .27 ? 3 : 1
    bug.textContent = roll < .12 ? '☠️' : roll < .27 ? '✨' : (Math.random() < .5 ? '🐛' : '🐞')
    bug.style.left = Math.random() * (bugsArea.clientWidth - 40) + 'px'
    bug.style.top = Math.random() * (bugsArea.clientHeight - 40) + 'px'
    bug.addEventListener('pointerdown', e => {
        e.preventDefault()
        const val = +bug.dataset.value
        bugsScore = Math.max(0, bugsScore + val)
        bugsScoreEl.textContent = bugsScore
        const pop = document.createElement('span')
        pop.className = 'bug-pop'
        pop.textContent = val > 0 ? `+${val}` : val
        pop.style.color = val > 0 ? 'var(--game-ok)' : 'var(--game-bad)'
        pop.style.left = bug.style.left
        pop.style.top = bug.style.top
        bugsArea.appendChild(pop)
        setTimeout(() => pop.remove(), 600)
        bug.remove()
    })
    bugsArea.appendChild(bug)
    setTimeout(() => bug.remove(), 1600)
}

const bugsEnd = () => {
    clearInterval(bugsTimer); clearInterval(bugsSpawner)
    bugsTimer = bugsSpawner = null
    bugsArea.querySelectorAll('.bug').forEach(b => b.remove())
    if (bugsScore > bugsRecord) {
        bugsRecord = bugsScore
        localStorage.setItem('bugs-record', bugsRecord)
        bugsRecordEl.textContent = bugsRecord
    }
    bugsOverlay.querySelector('h3').textContent = `☠️ ${bugsScore} bugs eliminados`
    bugsOverlay.querySelector('p').textContent = bugsScore >= bugsRecord && bugsScore > 0
        ? '¡Nuevo récord! 🏆 El código quedó limpio.'
        : 'El código sigue con bugs… ¿otra ronda?'
    bugsStart.textContent = 'Reintentar'
    bugsOverlay.hidden = false
}

const bugsReset = () => {
    if (!bugsTimer) return
    clearInterval(bugsTimer); clearInterval(bugsSpawner)
    bugsTimer = bugsSpawner = null
    bugsArea.querySelectorAll('.bug').forEach(b => b.remove())
    bugsStart.textContent = 'Iniciar debug'
    bugsOverlay.hidden = false
}

bugsStart.addEventListener('click', () => {
    bugsScore = 0; bugsTime = 30
    bugsScoreEl.textContent = 0; bugsTimeEl.textContent = 30
    bugsOverlay.hidden = true
    bugsTimer = setInterval(() => {
        bugsTimeEl.textContent = --bugsTime
        if (bugsTime <= 0) bugsEnd()
    }, 1000)
    bugsSpawner = setInterval(bugsSpawn, 520)
})

/*=============== JUEGO 3: SPEED CODE ===============*/
const TYPE_SNIPPETS = [
    "const dev = 'Joel';\nconsole.log(`Hola, soy ${dev}`);",
    "function suma(a, b) {\n  return a + b;\n}",
    "$stmt = $conn->prepare('SELECT * FROM apps');\n$stmt->execute();",
    "const skills = ['PHP', 'JS', 'SQL'];\nskills.forEach(s => console.log(s));",
    "SELECT nombre, rol FROM devs\nWHERE pais = 'Panamá';"
]
const typeSnippetEl = document.getElementById('type-snippet')
const typeInput = document.getElementById('type-input')
const typeWpmEl = document.getElementById('type-wpm')
const typeAccEl = document.getElementById('type-acc')
const typeTimeEl = document.getElementById('type-time')
const typeDoneEl = document.getElementById('type-done')

let typeTarget = '', typeStart = null, typeTick = null, typeErrors = 0, typeLastLen = 0

const typeRender = typed => {
    let html = ''
    for (let i = 0; i < typeTarget.length; i++) {
        const esc = typeTarget[i].replace(/&/g, '&amp;').replace(/</g, '&lt;')
        if (i < typed.length) html += `<span class="${typed[i] === typeTarget[i] ? 'done' : 'err'}">${esc}</span>`
        else if (i === typed.length) html += `<span class="cursor">${esc}</span>`
        else html += esc
    }
    typeSnippetEl.innerHTML = html
}

const typeLoad = () => {
    typeTarget = TYPE_SNIPPETS[Math.floor(Math.random() * TYPE_SNIPPETS.length)]
    typeStart = null; typeErrors = 0; typeLastLen = 0
    clearInterval(typeTick)
    typeInput.value = ''; typeInput.disabled = false
    typeDoneEl.hidden = true
    typeWpmEl.textContent = 0; typeAccEl.textContent = '100%'; typeTimeEl.textContent = '0.0'
    typeRender('')
}

typeInput.addEventListener('input', () => {
    const typed = typeInput.value
    if (typeStart === null && typed.length) {
        typeStart = performance.now()
        typeTick = setInterval(() => {
            const secs = (performance.now() - typeStart) / 1000
            typeTimeEl.textContent = secs.toFixed(1)
            typeWpmEl.textContent = Math.round((typeInput.value.length / 5) / (secs / 60)) || 0
        }, 100)
    }
    if (typed.length > typeLastLen && typed[typed.length - 1] !== typeTarget[typed.length - 1]) typeErrors++
    typeLastLen = typed.length
    typeAccEl.textContent = typed.length
        ? Math.max(0, Math.round((typed.length - typeErrors) / typed.length * 100)) + '%'
        : '100%'
    typeRender(typed)
    if (typed === typeTarget) {
        clearInterval(typeTick)
        typeInput.disabled = true
        typeDoneEl.hidden = false
    }
})

document.getElementById('type-next').addEventListener('click', () => { typeLoad(); typeInput.focus() })
typeLoad()

/*=============== REPOSITORIOS DE GITHUB ===============*/
const reposContainer = document.getElementById('repos-container')

const langColors = {
    JavaScript: '#f0db4f', TypeScript: '#3178c6', PHP: '#8892be',
    HTML: '#e44d26', CSS: '#2965f1', Python: '#3776ab',
    Java: '#b07219', 'C#': '#178600', 'C++': '#f34b7d', Vue: '#41b883'
}

const escapeHtml = text => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
}

const reposToggle = document.getElementById('repos-toggle')
const REPOS_VISIBLE = 6

const shorten = (text, max = 90) =>
    text.length > max ? text.slice(0, max).trimEnd() + '…' : text

fetch('https://api.github.com/users/JoelAPL/repos?per_page=100&sort=pushed')
    .then(res => {
        if (!res.ok) throw new Error(`GitHub API: ${res.status}`)
        return res.json()
    })
    .then(repos => {
        repos = repos.filter(r => !r.fork && !r.archived)

        reposContainer.innerHTML = repos.map((repo, i) => `
            <article class="repo-card reveal visible" ${i >= REPOS_VISIBLE ? 'data-extra hidden' : ''}>
                <div class="repo-card__header">
                    <i class='bx bx-code-alt'></i>
                    <h3>${escapeHtml(repo.name.replace(/[-_]/g, ' '))}</h3>
                </div>
                <p>${escapeHtml(shorten(repo.description || 'Proyecto en GitHub.'))}</p>
                <div class="repo-card__footer">
                    ${repo.language ? `<span class="repo-card__lang" style="--lang-color:${langColors[repo.language] || '#6C63FF'}">${escapeHtml(repo.language)}</span>` : '<span></span>'}
                    <a class="repo-card__link" href="${repo.html_url}" target="_blank" rel="noopener" aria-label="Ver ${escapeHtml(repo.name)} en GitHub">
                        Ver repo <i class='bx bx-right-arrow-alt'></i>
                    </a>
                </div>
            </article>
        `).join('')

        if (repos.length > REPOS_VISIBLE) {
            reposToggle.hidden = false
            reposToggle.addEventListener('click', () => {
                const expanded = reposToggle.classList.toggle('expanded')
                document.querySelectorAll('[data-extra]').forEach(card => card.hidden = !expanded)
                reposToggle.innerHTML = expanded
                    ? "Ver menos <i class='bx bx-chevron-up'></i>"
                    : "Ver todos los repositorios <i class='bx bx-chevron-down'></i>"
            })
        }
    })
    .catch(() => {
        reposContainer.innerHTML = `
            <p class="repos__error">
                No se pudieron cargar los repositorios ahora mismo.
                Puedes verlos directamente en
                <a class="repo-card__link" href="https://github.com/JoelAPL" target="_blank" rel="noopener">github.com/JoelAPL</a>
            </p>`
    })

/*=============== AÑO DEL FOOTER ===============*/
document.getElementById('year').textContent = new Date().getFullYear()
