import Header from '../components/Header'
import CodeBlock from '../components/CodeBlock'
import { projects, type Project, type Troubleshooting } from '../data/portfolio'

function TroubleshootingBlock({ t, index }: { t: Troubleshooting; index: number }) {
  const steps: [string, string[]][] = [
    ['문제 상황', t.problem],
    ['선택한 방법과 이유', t.method],
    ['구현 · 검증 결과', t.implementation],
    ['남은 한계', t.limits],
  ]
  return (
    <article className="ts">
      <h3 className="ts__title">
        <span className="ts__no">Trouble Shooting {index + 1}</span>
        {t.title}
      </h3>
      <div className="ts__steps">
        {steps.map(([label, lines]) => (
          <section key={label} className="ts__step">
            <h4>{label}</h4>
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
        ))}
      </div>
      {t.diagram && (
        <figure className="figure">
          <img src={t.diagram.src} alt={t.diagram.alt} loading="lazy" />
        </figure>
      )}
      {t.code && <CodeBlock sample={t.code} />}
    </article>
  )
}

export default function ProjectPage({ project }: { project: Project }) {
  const i = projects.findIndex((p) => p.slug === project.slug)
  const next = projects[(i + 1) % projects.length]
  return (
    <div className="page" style={{ ['--accent' as string]: project.accent }}>
      <Header />
      <main>
        <a className="back" href="#/">← 모든 프로젝트</a>

        <section className="phero">
          <div className="phero__logo">
            <img src={project.logo} alt={project.name} />
          </div>
          <div>
            <p className="card__no">Project {project.order} · {project.name}</p>
            <h1 className="phero__title">{project.tagline}</h1>
            {project.summary.map((s) => (
              <p key={s} className="phero__summary">{s}</p>
            ))}
          </div>
        </section>

        <dl className="meta">
          <div><dt>기간</dt><dd>{project.period}</dd></div>
          <div><dt>팀</dt><dd>{project.team}</dd></div>
          <div><dt>담당</dt><dd>{project.role}</dd></div>
          <div>
            <dt>GitHub</dt>
            <dd><a href={project.repo.url} target="_blank" rel="noreferrer">{project.repo.label}</a></dd>
          </div>
          <div className="meta__wide">
            <dt>기술</dt>
            <dd className="tags">{project.stack.map((s) => <span key={s} className="tag">{s}</span>)}</dd>
          </div>
        </dl>

        <aside className="scope">
          <strong>담당 범위</strong>
          <p>{project.scopeNote}</p>
        </aside>

        {project.diagrams && (
          <section className="section">
            <h2 className="section__title">구조</h2>
            <div className="diagrams">
              {project.diagrams.map((d) => (
                <figure key={d.src} className="figure">
                  <a href={d.src} target="_blank" rel="noreferrer"><img src={d.src} alt={d.alt} loading="lazy" /></a>
                  <figcaption>{d.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <h2 className="section__title">구현 기능</h2>
          {project.features.map((group) => (
            <div key={group.lead} className="fgroup">
              <p className="fgroup__lead">{group.lead}</p>
              <div className="features">
                {group.items.map((f) => (
                  <div key={f.title} className="feature">
                    <h3>{f.title}</h3>
                    <ul>{f.points.map((p) => <li key={p}>{p}</li>)}</ul>
                  </div>
                ))}
              </div>
              {group.code && <CodeBlock sample={group.code} />}
            </div>
          ))}
        </section>

        {project.troubleshooting.length > 0 && (
          <section className="section">
            <h2 className="section__title">트러블슈팅</h2>
            {project.troubleshooting.map((t, idx) => (
              <TroubleshootingBlock key={t.title} t={t} index={idx} />
            ))}
          </section>
        )}

        <section className="section">
          <h2 className="section__title">회고 <span className="section__sub">{project.reviewSource}</span></h2>
          <ul className="review">
            {project.review.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>

        <a className="next" href={`#/projects/${next.slug}`}>
          다음 프로젝트 <strong>{next.name}</strong> →
        </a>
      </main>
      <footer className="footer">© 2026 제민기</footer>
    </div>
  )
}
