export default function ProjectCard({ project, isActive, onSelect }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(project.id);
    }
  };

  return (
    <article
      className={`project__card project__card--${project.id}${isActive ? ' is-active' : ''}`}
      data-project={project.id}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      onClick={() => onSelect(project.id)}
      onKeyDown={handleKeyDown}
    >
      <span className="project__card-icon">
        <img src={project.icon} alt="" />
      </span>
      <span className="project__card-divider" aria-hidden="true"></span>
      <span className="project__card-body">
        <h3>{project.title}</h3>
        <p>{project.shortDescription}</p>
      </span>
    </article>
  );
}
