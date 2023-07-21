package nus.iss.tfip.miniProject.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nus.iss.tfip.miniProject.models.Note;
import nus.iss.tfip.miniProject.models.ReturnNote;
import nus.iss.tfip.miniProject.services.NoteService;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    
    @Autowired
    private NoteService noteService;

    @PostMapping
    public ReturnNote createNote(@RequestBody ReturnNote retNote){
        Note createNote = new Note();
        createNote.setNameSymbol(retNote.getNameSymbol());
        createNote.setContent(retNote.getContent());
        createNote.setTimestamp(LocalDateTime.now()); //set the localDateTime using java time
        noteService.createNote(createNote);
        return retNote;
    }

    @GetMapping("/{nameSymbol}")
    public ResponseEntity<ReturnNote> getNote(@PathVariable String nameSymbol){
        Optional<Note> getNoteOpt = noteService.getNote(nameSymbol);
        if (getNoteOpt.isPresent()){
            Note getNote = getNoteOpt.get();
            ReturnNote retNote = new ReturnNote();
            retNote.setNameSymbol(getNote.getNameSymbol());
            retNote.setContent(getNote.getContent());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm'hrs'");
            String formattedDateTime = getNote.getTimestamp().format(formatter);
            retNote.setDate(formattedDateTime);
            return new ResponseEntity<>(retNote, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @PutMapping("/{nameSymbol}")
    public ReturnNote updateNote(@PathVariable String nameSymbol, @RequestBody ReturnNote retNote){
        Note createNote = new Note();
        createNote.setNameSymbol(retNote.getNameSymbol());
        createNote.setContent(retNote.getContent());
        createNote.setTimestamp(LocalDateTime.now()); //set the localDateTime using java time'
        noteService.updateNote(nameSymbol, createNote);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm'hrs'");
        String formattedDateTime = createNote.getTimestamp().format(formatter);
        retNote.setDate(formattedDateTime);
        return retNote;
    }

    @DeleteMapping("/{nameSymbol}")
    public void deleteNote(@PathVariable String nameSymbol){
        noteService.deleteNote(nameSymbol);
    }
}
