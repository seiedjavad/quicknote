import { FormEvent, useMemo, useState } from 'react';
import './styles.css';

type NoteColor = 'default' | 'yellow' | 'mint' | 'blue' | 'rose' | 'purple';

type Note = {
  id: number;
  title: string;
  body: string;
  color: NoteColor;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
};

const colorOptions: Array<{ value: NoteColor; label: string }> = [
  { value: 'default', label: 'Default' },
  { value: 'yellow', label: 'Sunrise' },
  { value: 'mint', label: 'Mint' },
  { value: 'blue', label: 'Sky' },
  { value: 'rose', label: 'Rose' },
  { value: 'purple', label: 'Lavender' },
];

const initialNotes: Note[] = [
  {
    id: 1,
    title: 'Finalize launch checklist',
    body: 'Review homepage copy, verify analytics events, and confirm the support inbox is ready before publishing.',
    color: 'yellow',
    tags: ['Work', 'Launch'],
    pinned: true,
    updatedAt: 'Today',
  },
  {
    id: 2,
    title: 'Weekend market list',
    body: 'Fresh basil, sourdough, lemons, coffee beans, and something bright for the desk.',
    color: 'mint',
    tags: ['Personal'],
    pinned: false,
    updatedAt: 'Yesterday',
  },
  {
    id: 3,
    title: 'Design inspiration',
    body: 'Soft shadows, playful rounded corners, warm neutrals, and small delightful micro-interactions.',
    color: 'rose',
    tags: ['Ideas', 'Design'],
    pinned: true,
    updatedAt: 'Apr 24',
  },
  {
    id: 4,
    title: 'Book notes',
    body: 'Great products feel obvious after they exist. Keep the first version small enough to finish and polished enough to trust.',
    color: 'blue',
    tags: ['Reading'],
    pinned: false,
    updatedAt: 'Apr 22',
  },
  {
    id: 5,
    title: 'Quick standup',
    body: 'Yesterday: UI polish. Today: note creation flow. Blockers: none.',
    color: 'purple',
    tags: ['Work'],
    pinned: false,
    updatedAt: 'Apr 20',
  },
];

const navItems = [
  { icon: '💡', label: 'Notes', active: true },
  { icon: '🔔', label: 'Reminders', active: false },
  { icon: '🏷️', label: 'Labels', active: false },
  { icon: '📦', label: 'Archive', active: false },
  { icon: '🗑️', label: 'Trash', active: false },
];

function App() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftColor, setDraftColor] = useState<NoteColor>('default');

  const tags = useMemo(() => {
    const uniqueTags = new Set(notes.flatMap((note) => note.tags));
    return ['All', ...Array.from(uniqueTags).sort()];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [note.title, note.body, ...note.tags].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      const matchesTag = selectedTag === 'All' || note.tags.includes(selectedTag);

      return matchesQuery && matchesTag;
    });
  }, [notes, query, selectedTag]);

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const otherNotes = filteredNotes.filter((note) => !note.pinned);

  const handleCreateNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draftTitle.trim() && !draftBody.trim()) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: draftTitle.trim() || 'Untitled note',
      body: draftBody.trim(),
      color: draftColor,
      tags: ['Quicknote'],
      pinned: false,
      updatedAt: 'Just now',
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setDraftTitle('');
    setDraftBody('');
    setDraftColor('default');
  };

  const togglePin = (noteId: number) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId ? { ...note, pinned: !note.pinned } : note,
      ),
    );
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <button className="icon-button menu-button" aria-label="Open menu">
            ☰
          </button>
          <div className="brand-mark">Q</div>
          <span>Quicknote</span>
        </div>

        <label className="search-box" aria-label="Search notes">
          <span>🔍</span>
          <input
            type="search"
            placeholder="Search your notes"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="topbar-actions">
          <button className="icon-button" aria-label="Refresh notes">
            ↻
          </button>
          <button className="icon-button" aria-label="Toggle view">
            ▦
          </button>
          <div className="avatar" aria-label="User profile">
            SJ
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${item.active ? 'active' : ''}`}
              type="button"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>

        <main className="content">
          <section className="hero-card">
            <div>
              <p className="eyebrow">Inspired by Google Keep</p>
              <h1>Capture ideas before they drift away.</h1>
              <p>
                A clean note board with pinned cards, labels, search, and a calm
                interface for fast daily capture.
              </p>
            </div>
            <div className="hero-stats">
              <strong>{notes.length}</strong>
              <span>active notes</span>
            </div>
          </section>

          <form className="composer" onSubmit={handleCreateNote}>
            <input
              type="text"
              placeholder="Title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <textarea
              placeholder="Take a note..."
              rows={3}
              value={draftBody}
              onChange={(event) => setDraftBody(event.target.value)}
            />
            <div className="composer-footer">
              <div className="color-picker" aria-label="Choose note color">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`color-dot ${color.value} ${
                      draftColor === color.value ? 'selected' : ''
                    }`}
                    type="button"
                    aria-label={`Use ${color.label} color`}
                    onClick={() => setDraftColor(color.value)}
                  />
                ))}
              </div>
              <button className="primary-button" type="submit">
                Add note
              </button>
            </div>
          </form>

          <div className="filter-row" aria-label="Filter notes by label">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`filter-chip ${selectedTag === tag ? 'selected' : ''}`}
                type="button"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <NoteSection title="Pinned" notes={pinnedNotes} onTogglePin={togglePin} />
          <NoteSection title="Others" notes={otherNotes} onTogglePin={togglePin} />

          {filteredNotes.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h2>No notes found</h2>
              <p>Try a different search term or label filter.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

type NoteSectionProps = {
  title: string;
  notes: Note[];
  onTogglePin: (noteId: number) => void;
};

function NoteSection({ title, notes, onTogglePin }: NoteSectionProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <section className="note-section">
      <h2>{title}</h2>
      <div className="notes-grid">
        {notes.map((note) => (
          <article className={`note-card ${note.color}`} key={note.id}>
            <div className="note-card-header">
              <h3>{note.title}</h3>
              <button
                className={`pin-button ${note.pinned ? 'pinned' : ''}`}
                type="button"
                aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                onClick={() => onTogglePin(note.id)}
              >
                📌
              </button>
            </div>
            <p>{note.body}</p>
            <div className="note-tags">
              {note.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <footer>
              <span>{note.updatedAt}</span>
              <div className="note-actions" aria-label="Note actions">
                <button type="button" aria-label="Add reminder">
                  🔔
                </button>
                <button type="button" aria-label="Archive">
                  📦
                </button>
                <button type="button" aria-label="More options">
                  ⋯
                </button>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export default App;
