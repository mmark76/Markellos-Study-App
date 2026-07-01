import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "react-router-dom";
import { studyConfig } from "../../app/studyConfig";
import { studyDatabase } from "../../infrastructure/database/studyDatabase";
import { isDue } from "../../shared/utils/date";
import { useStudyContent } from "../content-import/useStudyContent";

export function HomePage() {
  const { units, flashcards } = useStudyContent();
  const progress = useLiveQuery(() => studyDatabase.cardProgress.toArray(), []) ?? [];
  const sessions = useLiveQuery(
    () => studyDatabase.studySessions.orderBy("startedAt").reverse().limit(5).toArray(),
    [],
  ) ?? [];
  const availableCardIds = new Set(flashcards.map((card) => card.id));
  const due = progress.filter(
    (item) => availableCardIds.has(item.cardId) && isDue(item.nextReviewAt),
  ).length;
  const hasContent = units.length > 0 || flashcards.length > 0;
  const nextAction = !hasContent
    ? { to: "/import", label: "Add your first content", detail: "Create a topic or import a spreadsheet to begin." }
    : due > 0
      ? { to: "/review", label: `Review ${due} due card${due === 1 ? "" : "s"}`, detail: "Strengthen knowledge before it fades." }
      : { to: "/study", label: "Continue learning", detail: "Choose the next step in your learning cycle." };

  return (
    <div className="stack-lg">
      <section className="hero-panel dashboard-hero">
        <div>
          <p className="eyebrow">Today</p>
          <h2>{studyConfig.subjectName || "Your learning dashboard"}</h2>
          <p>{studyConfig.description}</p>
        </div>
        <div className="next-action-card">
          <strong>Recommended next step</strong>
          <p>{nextAction.detail}</p>
          <Link className="button primary" to={nextAction.to}>{nextAction.label}</Link>
        </div>
      </section>

      <section className="stats-grid" aria-label="Study overview">
        <article className="stat-card"><strong>{units.length}</strong><span>{studyConfig.unitsLabel}</span></article>
        <article className="stat-card"><strong>{flashcards.length}</strong><span>Flashcards</span></article>
        <article className="stat-card"><strong>{due}</strong><span>Ready to review</span></article>
        <article className="stat-card"><strong>{sessions.length}</strong><span>Recent sessions</span></article>
      </section>

      <section className="dashboard-action-grid" aria-label="Main areas">
        <article className="content-panel dashboard-action-card">
          <p className="eyebrow">Learn actively</p>
          <h3>Study &amp; Learn</h3>
          <p>Focus, understand, recall, apply and reflect in one guided learning cycle.</p>
          <Link className="button secondary" to="/study">Open Study &amp; Learn</Link>
        </article>
        <article className="content-panel dashboard-action-card">
          <p className="eyebrow">Your resources</p>
          <h3>Library</h3>
          <p>Organise books, articles, papers and personal notes.</p>
          <Link className="button secondary" to="/library">Open Library</Link>
        </article>
      </section>

      <section className="content-panel">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Recent activity</p>
            <h3>Learning history</h3>
          </div>
          <Link className="text-link" to="/progress">View all progress</Link>
        </div>
        {sessions.length === 0 ? (
          <p>Your completed study sessions will appear here.</p>
        ) : (
          <ul className="recent-activity-list">
            {sessions.map((session) => (
              <li key={session.id}>
                <span>{session.mode}</span>
                <strong>{session.reviewedCards} cards</strong>
                <time dateTime={session.startedAt}>{new Date(session.startedAt).toLocaleString("en-GB")}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
