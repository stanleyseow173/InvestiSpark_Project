import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { Estimation, LinkPreviewData, Post, StocksSearchSnippet } from 'app/models';
import { PostService } from 'app/_services/post.service';
import { StockService } from 'app/_services/stock.service';
import { StorageService } from 'app/_services/storage.service';
import { BehaviorSubject, debounceTime, of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create-dialog',
  templateUrl: './post-create-dialog.component.html',
  styleUrls: ['./post-create-dialog.component.css']
})
export class PostCreateDialogComponent implements OnInit, OnDestroy{

  keyUpSubject = new Subject<string>();
  stockOptions: StocksSearchSnippet[] = [];
  symbolOptions: StocksSearchSnippet[] = [];

  form: FormGroup;
  linkData: LinkPreviewData;

  @ViewChild('inputValue') inputValue;
  @ViewChild('symbolValue') symbolValue;

  private stocksSource = new BehaviorSubject<StocksSearchSnippet[]>([]);
  stocks$ = this.stocksSource.asObservable(); 

  private symbolsSource = new BehaviorSubject<StocksSearchSnippet[]>([]);
  symbols$ = this.symbolsSource.asObservable();

  private subscriptions: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<PostCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { authorEmail: string, content: string, tag: string, category: string, timestamp: string, symbol: string, target:string, targetDate:string } ,
    private postService: PostService,
    private readonly snackBar: MatSnackBar,
    private stockSvc: StockService,
    private fb: FormBuilder
  ){
    this.form = this.fb.group({
      authorEmail: [data.authorEmail],
      content: [data.content],
      tag: [data.tag],
      category: [data.category, Validators.required],
      timestamp: [data.timestamp],
      symbol: [data.symbol],
      target: [data.target],
      targetDate: [data.targetDate]
    })
  }
  

  ngOnInit() {
   this.form.patchValue({
    category: "General" //default category
    })
    const sub = this.keyUpSubject.pipe(
      debounceTime(300)
    ).subscribe(value => {
      //listen for tag in text
      if (value.endsWith('$')) {
        this.getStockOptions(value.slice(0, -1));
      }
      //listen for url string in text
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const match = urlRegex.exec(value);
      if(match){
        const sub2 = this.postService.getLinkPreview(match[0]).subscribe(data => {
          this.linkData = data;
        })
        this.subscriptions.add(sub2)
      }
    })
    this.subscriptions.add(sub);
  }

  //search string after $ sign
  keyUp(text: string) {
    const words = text.split(' ');
    const lastWord = words[words.length -1];
    
    this.keyUpSubject.next(text);
    if(lastWord.includes('$')){
      const splitText = lastWord.split('$');
      const searchString = splitText[splitText.length - 1];
      if(searchString.length>0){
        this.stocks$ = this.stockSvc.getBestMatches(searchString)
        return this.stockSvc.getBestMatches(searchString)
      }
    }
    this.stocks$ = of([])
    return Promise.resolve([])
  }

  //search string based on stock symbols - get results from backend
  keySymbol(text: string) {
    if(text.length>0){
      this.symbols$ = this.stockSvc.getSymbolMatches(text)
      return this.stockSvc.getSymbolMatches(text)
    }
    this.symbols$ = of([])
    return Promise.resolve([])
  }

  //search string based on stock symbols and names
  getStockOptions(searchString: string) {
    const sub3 = this.stockSvc.getBestMatches(searchString).subscribe(stocks => {
      this.stockOptions = stocks;
    });
    this.subscriptions.add(sub3);
  }

  //replace str after $ with the complete stock symbol with $ --> i.e. $MSF --> $MSFT or $M --> $MSFT based on user's selections
  selectTag(symbol: string) {
    const words = this.form.value.content.split(' ');
    const lastWord = words[words.length-1];
    this.form.patchValue({
      content: this.form.value.content.slice(0,this.form.value.content.length-lastWord.length+1) + symbol + ' '
    });
    this.stockOptions = [];
    this.keyUp('');
  }

  //if a symbol is selected - then patch the form value and reset symbol and key options
  selectSymbol(symbol: string){
    this.form.patchValue({
      symbol: symbol
    })
    this.symbolOptions=[];
    this.keySymbol('');
  }

  loadGreenSnackBar(message){
    this.snackBar.openFromComponent(ComponentscustomSnackbarComponent,{
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar',
      data: {
        title: 'Success',
        message: message
      }
    })
  }

  //extract all tags in the content and concatenate them with ,
  extractTags() {
    const tagArray = this.form.value.content.match(/\$[a-z0-9_]+/gi); // this regular expression matches words that start with a '$' and consist of letters, digits, and underscores
    if (tagArray) {
      this.form.value.tag = tagArray.join(',');
    } else {
      this.form.value.tag = ''; // if there are no tags in the content, reset the tags
    }
  }

  createPost():void{
    //check form validity
    if (this.form.invalid){
      return;
    }
    //extract tags
    this.extractTags();
    //create posts in backend
    const sub4 = this.postService.createPost(this.form.value).subscribe(()=>{
      this.dialogRef.close();
      this.loadGreenSnackBar('Post created!')
      window.location.reload() //reload to show new post
    }
    )
    this.subscriptions.add(sub4);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
