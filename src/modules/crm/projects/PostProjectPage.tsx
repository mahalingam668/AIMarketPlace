import { useState, type FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { ClipboardList, FolderKanban, Plus, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../../store';
import { addProject, closeProject, deleteProject } from '../../../store/slices/projectsSlice';
import StatusBadge from '../components/StatusBadge';

const EMPTY_DRAFT = {
  title: '',
  description: '',
  budgetMin: 1000,
  budgetMax: 5000,
  deadline: '',
};

function formatBudget(min: number, max: number) {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function PostProjectPage() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.projects.projects);

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!draft.title.trim() || !draft.description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    if (draft.budgetMin <= 0 || draft.budgetMax <= 0) {
      toast.error('Budget values must be greater than $0.');
      return;
    }
    if (draft.budgetMax < draft.budgetMin) {
      toast.error('Budget max must be greater than or equal to budget min.');
      return;
    }
    if (!draft.deadline) {
      toast.error('Please choose a deadline.');
      return;
    }

    dispatch(
      addProject({
        id: `proj-${Date.now()}`,
        title: draft.title.trim(),
        description: draft.description.trim(),
        budgetMin: draft.budgetMin,
        budgetMax: draft.budgetMax,
        deadline: draft.deadline,
        status: 'open',
        createdAt: new Date().toISOString().slice(0, 10),
        proposalCount: 0,
      })
    );
    toast.success('Project brief posted. Developers can now submit proposals.');
    setDraft(EMPTY_DRAFT);
  };

  const handleClose = (id: string) => {
    dispatch(closeProject({ id }));
    toast.success('Project closed to new proposals.');
  };

  const confirmDelete = (id: string) => {
    dispatch(deleteProject(id));
    toast.success('Project deleted.');
    setPendingDeleteId(null);
  };

  return (
    <div>
      <div className="crm-page-header">
        <div className="crm-page-header__row">
          <div className="crm-page-header__heading">
            <span className="crm-page-header__icon" aria-hidden="true">
              <ClipboardList size={22} />
            </span>
            <div>
              <h1 className="crm-page-header__title">Post a Project</h1>
              <p className="crm-page-header__subtitle">
                Describe the scope, budget range, and deadline for bespoke AI work — matching developers can then
                submit custom proposals.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="crm-section">
        <h3 className="crm-section__title">
          <Plus size={16} /> Create a Project Brief
        </h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="crm-form-grid">
            <div className="crm-form-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="project-title">Project Title</label>
              <input
                id="project-title"
                type="text"
                placeholder="e.g. Build a custom RAG chatbot for our support team"
                value={draft.title}
                onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="crm-form-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                rows={4}
                placeholder="Describe the scope of work, deliverables, and any technical requirements..."
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="crm-form-field">
              <label htmlFor="project-budget-min">Budget Min (USD)</label>
              <input
                id="project-budget-min"
                type="number"
                min={0}
                value={draft.budgetMin}
                onChange={(e) => setDraft((prev) => ({ ...prev, budgetMin: Number(e.target.value) }))}
              />
            </div>

            <div className="crm-form-field">
              <label htmlFor="project-budget-max">Budget Max (USD)</label>
              <input
                id="project-budget-max"
                type="number"
                min={0}
                value={draft.budgetMax}
                onChange={(e) => setDraft((prev) => ({ ...prev, budgetMax: Number(e.target.value) }))}
              />
            </div>

            <div className="crm-form-field">
              <label htmlFor="project-deadline">Deadline</label>
              <input
                id="project-deadline"
                type="date"
                value={draft.deadline}
                onChange={(e) => setDraft((prev) => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="crm-form-actions">
            <button type="submit" className="crm-btn crm-btn--primary">
              <Plus size={15} /> Post Project
            </button>
          </div>
        </form>
      </div>

      <div className="crm-section">
        <h3 className="crm-section__title">
          <FolderKanban size={16} /> My Projects
        </h3>

        {projects.length === 0 ? (
          <div className="crm-empty-state">
            <div className="crm-empty-state__icon">
              <FolderKanban size={20} />
            </div>
            <h4 className="crm-empty-state__title">No projects posted yet</h4>
            <p className="crm-empty-state__message">Create a project brief above to start receiving proposals.</p>
          </div>
        ) : (
          <div className="crm-table-wrap">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Budget</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Proposals</th>
                  <th className="crm-table__actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td><strong>{project.title}</strong></td>
                    <td>{formatBudget(project.budgetMin, project.budgetMax)}</td>
                    <td>{formatDeadline(project.deadline)}</td>
                    <td>
                      <StatusBadge status={project.status} tone={project.status === 'open' ? 'success' : 'neutral'} />
                    </td>
                    <td>{project.proposalCount}</td>
                    <td>
                      {pendingDeleteId === project.id ? (
                        <div className="crm-table__actions">
                          <button type="button" className="crm-btn crm-btn--danger" onClick={() => confirmDelete(project.id)}>
                            Confirm
                          </button>
                          <button type="button" className="crm-btn" onClick={() => setPendingDeleteId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="crm-table__actions">
                          {project.status === 'open' && (
                            <button type="button" className="crm-btn" onClick={() => handleClose(project.id)}>
                              Close
                            </button>
                          )}
                          <button
                            type="button"
                            className="crm-table__action-btn crm-table__action-btn--danger"
                            onClick={() => setPendingDeleteId(project.id)}
                            aria-label={`Delete ${project.title}`}
                            title="Delete project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostProjectPage;
