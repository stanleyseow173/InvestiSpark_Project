package nus.iss.tfip.miniProject.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nus.iss.tfip.miniProject.models.Note;
import nus.iss.tfip.miniProject.repositories.jpa.NoteRepository;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    public Optional<Note> getNote(String nameSymbol) {
        return noteRepository.findById(nameSymbol);
    }

    public Note updateNote(String nameSymbol, Note noteDetails) {
        Optional<Note> noteopt = getNote(nameSymbol);
        if(noteopt.isPresent()){
            Note note = noteopt.get();
            note.setContent(noteDetails.getContent());
            note.setTimestamp(noteDetails.getTimestamp());
            noteRepository.save(note);
            return note;
        }
        return null;
    }

    public void deleteNote(String nameSymbol) {
        noteRepository.deleteById(nameSymbol);
    }
}
