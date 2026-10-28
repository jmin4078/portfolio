import { useEffect, useState } from 'react'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import { projects } from './data/portfolio'

// Hash routes keep GitHub Pages happy: a refresh on #/projects/grab still loads index.html.
function useHashPath() {
  const read = () => window.location.hash.replace(/^#/, '') || '/'
  const [path, setPath] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setPath(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return path
}

export default function App() {
  const path = useHashPath()
  const match = path.match(/^\/projects\/([\w-]+)/)
  const project = match ? projects.find((p) => p.slug === match[1]) : undefined

  useEffect(() => {
    document.title = project ? `${project.name} — 제민기 포트폴리오` : '제민기 포트폴리오'
  }, [project])

  return project ? <ProjectPage project={project} /> : <Home />
}
