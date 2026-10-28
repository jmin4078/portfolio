import Header from '../components/Header'
import { profile, projects, skills, timeline } from '../data/portfolio'

export default function Home() {
  return (
    <div className="page">
      <Header />
      <main>
        <section className="hero">
          <div className="hero__id">
            <p className="hero__role">{profile.role}</p>
            <h1 className="hero__name">{profile.name}</h1>
            <p className="hero__headline">{profile.headline}</p>
            <div className="hero__links">
              <a className="chip" href={`mailto:${profile.email}`}>{profile.email}</a>
              <a className="chip" href={profile.github} target="_blank" rel="noreferrer">
                github.com/jmin4078
              </a>
            </div>
          </div>
          <ul className="hero__intro">
            {profile.intro.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="section" aria-labelledby="projects-title">
          <h2 id="projects-title" className="section__title">프로젝트</h2>
          <div className="cards">
            {projects.map((p) => (
              <a key={p.slug} className="card" href={`#/projects/${p.slug}`} style={{ ['--accent' as string]: p.accent }}>
                <div className="card__logo">
                  <img src={p.logo} alt={p.name} />
                </div>
                <div className="card__body">
                  <p className="card__no">Project {p.order}</p>
                  <h3 className="card__title">{p.tagline}</h3>
                  <p className="card__period">{p.period} · {p.team}</p>
                  <p className="card__role">{p.role}</p>
                  <span className="card__more">자세히 보기 →</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="section split">
          <div>
            <h2 className="section__title">기술</h2>
            <dl className="skills">
              {skills.map((s) => (
                <div key={s.group} className="skills__row">
                  <dt>{s.group}</dt>
                  <dd>{s.items}</dd>
                </div>
              ))}
            </dl>
            <p className="footnote">프로젝트에서 직접 작업한 범위만 적었습니다.</p>
          </div>
          <div>
            <h2 className="section__title">이력</h2>
            <ol className="timeline">
              {timeline.map((t) => (
                <li key={t.title}>
                  <span className="timeline__period">{t.period}</span>
                  <strong>{t.title}</strong>
                  <span className="timeline__detail">{t.detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <footer className="footer">© 2026 {profile.name}</footer>
    </div>
  )
}
