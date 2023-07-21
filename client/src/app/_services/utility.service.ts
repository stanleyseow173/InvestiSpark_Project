import { Injectable } from "@angular/core";

@Injectable()
export class UtilityService{

    //extract the first url from a text file 
    getUrlFromText(text: string): string | null {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = urlRegex.exec(text);
        if (match) {
          return match[0];
        } else {
          return null;
        }
    }

}