import { HttpClient} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Note } from "app/models";
import { Observable } from "rxjs";

const NOTE_URL = "/api/notes"

@Injectable()
export class NoteService{

    constructor(private http:HttpClient){}

    //Note creation - attach note to send to backend
    createNote(note: Note): Observable<Note>{
        return this.http.post<Note>(NOTE_URL, note);
    }

    //getting note based on nameSymbol - user's name and the stock symbol --> each user can have only 1 note per stock symbol
    getNote(nameSymbol: string): Observable<Note>{
        return this.http.get<Note>(`${NOTE_URL}/${nameSymbol}`);
    }

    //update note on backend using namesymbol and note
    updateNote(nameSymbol: string, note: Note): Observable<Note>{
        return this.http.put<Note>(`${NOTE_URL}/${nameSymbol}`, note);
    }

    //delete note on backend using namesymbol identitifer
    deleteNote(nameSymbol: string): Observable<void>{
        return this.http.delete<void>(`${NOTE_URL}/${nameSymbol}`)
    }
}