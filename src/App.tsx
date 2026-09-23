import Navbar from './components/Navbar'
import ScrollVideo from './components/ScrollVideo'
import SectionOne from './components/SectionOne'
import SectionTwo from './components/SectionTwo'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="relative">
      <ScrollVideo />
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-multiply" />
      <div aria-hidden="true" className="scroll-progress fixed inset-x-0 top-0 z-[60] h-px bg-ink/60" />
      <div className="relative z-10">
        <Navbar />
        <main>
          <SectionOne />
          {/* keeps scroll length so the video can scrub between sections */}
          <div aria-hidden="true" className="h-[80vh]" />
          <SectionTwo />
          {/* dense sections sit on a bright frosted veil so ink text stays legible over the video */}
          <div id="work" className="bg-gradient-to-b from-transparent via-white/60 via-[12%] to-white/70 text-ink">
            <Projects />
            <Experience />
            <Skills />
            <Contact />
          </div>
        </main>
      </div>
    </div>
  )
}
