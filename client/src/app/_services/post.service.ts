import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LinkPreviewData, Post } from "app/models";
import { Observable } from "rxjs";

const POST_URL = "/api/posts"

@Injectable()
export class PostService{

    constructor(private http: HttpClient){}

    getPosts(category?: string, tag?: string, followers?: string[], symbols?:string[]): Observable<Post[]> {
      let params = new HttpParams();
      if(category){
        params = params.set('category',category);
      }
      if(tag){
        params = params.set('tag',tag)
      }
      if(followers){
        const followersStr = followers.join(',')
        params = params.set('followers', followersStr)
      }
      if(symbols){
        const symbolsStr = symbols.join(',')
        params = params.set('symbols', symbolsStr)
      }
        return this.http.get<Post[]>(POST_URL,{params});
      }

    createPost(post: Post): Observable<Post> {
        return this.http.post<Post>(POST_URL, post);
      }

    getPostsByEmail(email: String): Observable<Post[]>{
      return this.http.get<Post[]>(`${POST_URL}/${email}`);
    }

    getLinkPreview(url: string): Observable<LinkPreviewData>{
      return this.http.post<LinkPreviewData>(`${POST_URL}/getMetaData`,{url});
    }
}