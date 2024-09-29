class Note {
    constructor(id, title, content) {
        this.id = id
        this.title = title
        this.content = content
    }
}

class NoteManager {
    constructor() {
        this.notes = []
        this.currentId = 0;
        this.editingId = null
        this.loadNotes()
    }

    addNote(title, content) {
        const newNote = new Note(this.currentId++, title, content)
        this.notes.push(newNote)
        this.saveNotes()
        this.render()
    }

    editNote(id, newTitle, newContent) {
        const note = this.notes.find(note => note.id === id)
        if (note) {
            note.title = newTitle
            note.content = newContent
            this.saveNotes()
            this.render()
            this.resetEditing()
        }
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id)
        this.saveNotes()
        this.render()
    }

    deleteAllNotes() {
        this.notes = []
        localStorage.removeItem('notes')
        this.render()
    }

    render() {
        const notesContainer = document.querySelector('.note-container')
        notesContainer.innerHTML = ''

        this.notes.forEach(note => {
            const noteDiv = document.createElement('div')
            noteDiv.className = 'note'
            noteDiv.innerHTML = 
                `<h3>${note.title}</h3>
                <p>${note.content}</p>
                <button onclick="noteManager.deleteNote(${note.id})">Удалить</button>
                <button onclick="noteManager.startEditing(${note.id})">Редактировать</button>`
            ;
            notesContainer.appendChild(noteDiv)
        })
    }

    startEditing(id) {
        const note = this.notes.find(note => note.id === id)
        if (note) {
            document.querySelector('.note-title').value = note.title
            document.querySelector('.note-content').value = note.content
            this.editingId = id
        }
    }

    resetEditing() {
        this.editingId = null
        document.querySelector('.note-title').value = '';
        document.querySelector('.note-content').value = '';
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }

    loadNotes() {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            this.notes = JSON.parse(savedNotes);
            this.currentId = this.notes.length > 0 ? Math.max(...this.notes.map(note => note.id)) + 1 : 0;
            this.render();
        }
    }
}

const noteManager = new NoteManager();

document.querySelector('.add-note-btn').addEventListener('click', () => {
    const title = document.querySelector('.note-title').value
    const content = document.querySelector('.note-content').value

    if (noteManager.editingId !== null) {
        noteManager.editNote(noteManager.editingId, title, content)
    } else {
        noteManager.addNote(title, content)
    }

    document.querySelector('.note-title').value = ''
    document.querySelector('.note-content').value = ''
});

document.querySelector('.delete-all-btn').addEventListener('click', () => {
    noteManager.deleteAllNotes()
});




