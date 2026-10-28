import { profile } from '../data/portfolio'

export default function Header() {
  return (
    <header className="header">
      <a className="header__brand" href="#/">
        {profile.name}
        <span className="header__dot" aria-hidden="true" />
      </a>
      <nav className="header__nav">
        <a href="#/">홈</a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={`mailto:${profile.email}`}>Contact</a>
      </nav>
    </header>
  )
}
