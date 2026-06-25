import { educationProfiles, type EducationLevel } from "./educationProfiles";

export function EducationLevelSelector({
  onSelect,
}: {
  onSelect: (level: EducationLevel) => Promise<void>;
}) {
  return (
    <section className="education-choice" aria-labelledby="education-level-title">
      <p className="eyebrow">First step</p>
      <h2 id="education-level-title">What are you studying for?</h2>
      <p>Choose the option that best matches your learning. The app will adjust its wording for you.</p>
      <div className="education-grid">
        {educationProfiles.map((profile) => (
          <button
            className="education-card"
            key={profile.id}
            type="button"
            onClick={() => void onSelect(profile.id)}
          >
            <strong>{profile.title}</strong>
            <span>{profile.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
