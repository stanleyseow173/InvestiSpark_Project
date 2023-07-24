import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResearchChecklistItem } from "app/models";
import { Observable } from "rxjs";

const CHECKLIST_URL = "/api/checklist"



@Injectable()
export class ChecklistService{

    constructor(private http:HttpClient){}

    saveChecklist(checklist: any):Observable<any>{
        return this.http.post(CHECKLIST_URL, checklist)
    }

    createNewChecklist(email: string):Observable<any>{
        //console.info("email received is:" + email)
        let params = new HttpParams();
        if(email){
            //console.info("set parameter")
            params = params.set('authorEmail',email);
        }
        return this.http.post(`${CHECKLIST_URL}/create`,{}, {params: params})
    }

    getChecklist(authorEmail: string){
        return this.http.get(`${CHECKLIST_URL}/${authorEmail}`);
    }

    getChecklistById(id: string){
        let params = new HttpParams();
        if(id){
            params = params.set('id',id);
        }
        return this.http.get(`${CHECKLIST_URL}`,{params: params})
    }

    saveResearchChecklistItems(nameSymbol: string, items: ResearchChecklistItem[]):Observable<any>{
        return this.http.post(`${CHECKLIST_URL}/researchChecklist`,{nameSymbol, items})
    }

    getResearchChecklist(nameSymbol: string): Observable<any>{
        return this.http.get(`${CHECKLIST_URL}/researchChecklist/${nameSymbol}`);
    }
}