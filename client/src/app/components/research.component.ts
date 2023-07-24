import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from 'app/app.service';
import { ChecklistIdentifier, LinkPreviewData, Note, ResearchChecklistItem, StockCurrent, StockOverview, StocksSearchSnippet } from 'app/models';
import { StockService } from 'app/_services/stock.service';
import { StorageService } from 'app/_services/storage.service';
import { BehaviorSubject, debounceTime, lastValueFrom, Observable, of, shareReplay, Subject, Subscription, switchMap, tap } from 'rxjs';
import { AddToWatchlistDialogComponent } from './add-to-watchlist-dialog.component';
import { NoteService } from 'app/_services/note.service';
import { SentimentService } from 'app/_services/sentiment.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { MatSnackBar} from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { FormControl } from '@angular/forms';
import { PostService } from 'app/_services/post.service';
import { UtilityService } from 'app/_services/utility.service';
import { UserService } from 'app/_services/user.service';
import { ChecklistService } from 'app/_services/checklist.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


declare var TradingView: any;

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit, OnDestroy{
  data : Date = new Date();
  focus;
  focus1;
  
  currentUser;

  stockChange = new Subject<number>;
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private storageService: StorageService,
    private stockSvc: StockService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private noteService: NoteService,
    private sentimentService: SentimentService,
    private readonly snackBar: MatSnackBar,
    private postService: PostService,
    private utilityService: UtilityService,
    private userService: UserService,
    private checklistService: ChecklistService
    ) { }

  iframeSrc: SafeResourceUrl;


  appSvc = inject(AppService)

  stockdata: any;
  stockDates = [];
  stockPrices = [];

  currentStockSymbol;
  currentStockName;

  stockCurrent$!: Observable<StockCurrent>;
  stockCurrentOverview$!: Observable<StockOverview>;

  inputValue: string = '';
  exchangeSymbol: string = '';

  @Input()
  filter=""

  private stocksSource = new BehaviorSubject<StocksSearchSnippet[]>([]);
  stocks$ = this.stocksSource.asObservable(); //Observable<StocksSearchSnippet[]>

  filterSubject = new BehaviorSubject<string>('');

  isLoading = false;

  articles = [];

  note: Note = new Note(''); //initialising note to prevent error when rendering
  nameSymbol: string;
  updateStatus: string ='';

  //posts on community
  posts$: Observable<any>;
  emailImageUrls = new Map<string, string>();
  linkPreviewData: { [postId: string]: Observable<LinkPreviewData> } = {};
  category = new FormControl('');
  followBtn = false;
  userNames = new Map<string, string>();

  //Sentiment Chart Details
  chartData: any[] = [] //to produce chart for sentiment analysis
  view: [number, number] = [600, 150];
  colorScheme:Color =  {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#C7B42C', '#A10A28']
  }; 

  textToAnalyze: string = '';


  getOrCreateNote(): Promise<Note> {
    return new Promise((resolve, reject) => {
      const sub = this.noteService.getNote(this.nameSymbol).subscribe({
        next: note => {
          this.note = note;
          resolve(note);
        },
        error: error => {
          console.log('Cannot get note:', error);
          this.createNote().then(note => resolve(note)).catch(err => reject(err));
        }
      })
      this.subscriptions.add(sub);
    });
  }
  
  createNote(): Promise<Note> {
    return new Promise((resolve, reject) => {
      const sub2 = this.noteService.createNote(new Note(this.nameSymbol)).subscribe({
        next: note => {
          this.note = note;
          resolve(note);
        },
        error: error => {
          console.log('Cannot create note', error);
          reject(error);
        }
      })
      this.subscriptions.add(sub2);
    });
  }

  updateNote(): void{
    const sub3 = this.noteService.updateNote(this.nameSymbol, this.note).subscribe({
      next: note =>{
        this.note = note;
        this.loadGreenSnackBar('Note Updated!')
      },
      error: error =>{
        console.log('failed to update note error', error)
      }
    }
    )
    this.subscriptions.add(sub3);
  }

  analyzeSentiment(testString: string){
    const sub4 = this.sentimentService.analyzeSentiment(testString).subscribe(
      data => {const {probability} = data;
      this.chartData = [
        {name: 'Positive', value: probability.pos},
        {name: 'Neutral', value: probability.neutral},
        {name: 'Negative', value: probability.neg}
      ]
      }
    )
    this.subscriptions.add(sub4)
  }

  ngOnInit(): void {
    
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.currentUser = this.storageService.getUser()
    const sub5 = this.userService.getAllUsers().subscribe(users =>{
      users.forEach(user => {
      const fullName = `${user.firstname} ${user.lastname}`;
      this.userNames.set(user.email, fullName);

      //get image for each user
      const sub6 = this.userService.getPhoto(user.email).subscribe(url=>{
        this.emailImageUrls.set(user.email, url);
      })
      this.subscriptions.add(sub6)
      })
    })
    this.subscriptions.add(sub5)
    this.loadChecklists();
    const sub7 = this.filterSubject.pipe(
        tap(()=> {
          this.isLoading = true
        }),  
        debounceTime(500),
        switchMap(filterValue => this.filtering(filterValue)),
        tap(() => {
          this.isLoading = false
        })).subscribe()
    this.subscriptions.add(sub7)

    this.getPosts();

    this.posts$ = this.postService.getPosts(this.category.value, this.currentStockSymbol);
    const sub8 = this.posts$.subscribe(posts => {
      posts.forEach(post => {
        const url = this.utilityService.getUrlFromText(post.content);
        if (url) {
          this.linkPreviewData[post.id] = this.postService.getLinkPreview(url);
        }
      });
    });
    this.subscriptions.add(sub8)
  }

  getPosts(): void {
    if(this.followBtn){
      const sub9 = this.userService.getFollowing(this.currentUser.email).subscribe(followers => {
        this.posts$ = this.postService.getPosts(this.category.value, this.currentStockSymbol, followers);
      })
      this.subscriptions.add(sub9);
    } else {
      this.posts$ = this.postService.getPosts(this.category.value, this.currentStockSymbol);
    }
  }

  onFilterChange():void{
    this.getPosts();
  }

  getUserFirstLastName(email: string){
    return this.userNames.get(email) || 'Loading...';
  }

  getTags(tagString: string){
    return tagString.split(',');
  }

  changeSymbol(symbol: string) {
    const url = `assets/tradingview.html?symbol=${encodeURIComponent(symbol)}`;
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  truncateText(text: string, num: number){
    const minNumber = Math.min(text.length,num)
    if(text.length>num){
      return text.slice(0, minNumber)+"..."
    }
    else{
      return text.slice(0, minNumber)
    }
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

  getNews(symbol: string){
    return this.stockSvc.getNews(symbol) 
  }

  getNewsButton(symbol: string){
    const sub10 = this.getNews(symbol).subscribe((response: any) => {
      const articles = response.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.image_url,
      }));
      this.articles = articles;
      for (let art of articles){
        this.textToAnalyze = this.textToAnalyze + " " + art.title //concatenate titles to analyze
      }
      this.analyzeSentiment(this.textToAnalyze)
    })
    this.subscriptions.add(sub10)
  }

  /*



  CHECKLIST PORTION


  */
  
  checklistsDropDown: ChecklistIdentifier[] = [];
  selectedChecklist: string;
  checklistItems: ResearchChecklistItem[] = [];
  newItemString: string = '';

  loadChecklists(): void {
    const sub11 = this.checklistService.getChecklist(this.currentUser.email).subscribe(
      (checklists: any[]) =>{
        if (checklists.length>0){
          //take first checklist found
          
          //map received data to checklistDropdown
          this.checklistsDropDown = checklists.map(
            checklist => {
              return {id: checklist.id, title: checklist.title} as ChecklistIdentifier;
            }
          )
        }
    })
    this.subscriptions.add(sub11);
  }

  loadChecklistItems(id:string): void {
    const sub12 = this.checklistService.getChecklistById(id).subscribe(
      (data: any) =>{
        this.checklistItems = data.items.map(
          item =>{
            return {
              checked: false,
              item: item,
              remarks: ''
            } as ResearchChecklistItem
          }
        );
      }
    );
    this.subscriptions.add(sub12);
  }

  addItem(){
    let newChecklistItem = new ResearchChecklistItem;
    newChecklistItem.item = this.newItemString
    this.checklistItems.push(newChecklistItem);
    this.newItemString = '';
  }

  removeItem(index: number){
    this.checklistItems.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>){
    moveItemInArray(this.checklistItems,event.previousIndex,event.currentIndex)
  }

  //save items in checklist --> tagged by nameSymbol
  saveItems(){
    const sub13 = this.checklistService.saveResearchChecklistItems(this.nameSymbol, this.checklistItems).subscribe((res)=>{ //change to this.nameSymbol afterwards
      this.loadGreenSnackBar(
        "Checklist saved!"
      )
    })
    this.subscriptions.add(sub13)
  }

  //finds checklist in database -> if none - create empty checklist
  getChecklist(){
    const sub14 = this.checklistService.getResearchChecklist(this.nameSymbol).subscribe({
      next: data =>{
        if(data.items!=null){
          this.checklistItems = data.items;
        }
      },error: error=>{
        console.info("cannot find existing checklist: setting empty checklist")
        this.checklistItems = [];
        console.log(error);
      }
    }
    )
    this.subscriptions.add(sub14) 
  }

  addStocktoWatchlist(): void {
    let stock = {
      symbol: this.currentStockSymbol,
      name: this.currentStockName,
      buytarget: null,
      selltarget: null
    }
    this.dialog.open(AddToWatchlistDialogComponent, {
      width: '500px',
      data: { email: this.currentUser.email, stock: stock }
    });
  }

  //test function to reload all stock symbols
  testLoad(){
    const sub15 = this.stockSvc.loadAllSymbols().subscribe(res=>{
      if(res){
        this.loadGreenSnackBar("Stock Symbols Updated!")
      } else{
        alert("Something went wrong..")
      }
    })
    this.subscriptions.add(sub15);
  }

  //filtering searching string for suggestionss dropdown
  filtering(text: string){
    if(text){
      this.filter = text
      this.stocks$ = this.stockSvc.getBestMatches(this.filter)
      return this.stockSvc.getBestMatches(this.filter)
    } else {
      this.stocks$ = of([]);
      return Promise.resolve([])
    }
  }

  isPositiveChange(change: string): boolean {
    return parseFloat(change) > 0;
  }

  getPrices(ticker: String){
    this.stockDates = [];
    this.stockPrices = [];
    const sub16 = this.stockSvc.getFullDailyPrices(ticker).pipe(shareReplay()).subscribe(
      data =>  {
        this.stockdata = data['Time Series (Daily)']
        var dates = Object.keys(this.stockdata)
        for(let i =0; i < 500 && i < dates.length; i++){
          this.stockDates.push(dates[i]);
          this.stockPrices.push(this.stockdata[dates[i]]['5. adjusted close'])
        }
      }
    )
    this.subscriptions.add(sub16);
  }

  updateStockOverview(){
    this.stockCurrentOverview$ = this.stockSvc.updateOverview(this.currentStockSymbol)
  }

  //main function used to get all the information related to a particular ticker
  getQuote(ticker: String, name: String){
    this.currentStockSymbol = ticker;
    this.currentStockName = name;
    this.stockCurrent$ = this.stockSvc.getLatestQuote(ticker);
    this.stockCurrentOverview$ = this.stockSvc.getOverview(ticker);
    lastValueFrom(this.stockCurrentOverview$).then(res=> {
      this.inputValue = res.symbol + ":(" + res.name +")"
      this.exchangeSymbol = res.exchange + ":" + res.symbol //create exchange symbol to call trading view widget
      this.nameSymbol = this.currentUser.email + res.symbol //create unique identifier to store notes
      this.getNewsButton(res.symbol)
      this.getPosts()
      this.getChecklist()
      return this.changeSymbol(this.exchangeSymbol);
    }).then(() =>{
      return this.getOrCreateNote();
    }).then(()=>{
      this.stocks$ = of([]);
    }).catch(error=>{
      console.error(error)
    })
  }

  ngOnDestroy(){
    const body = document.getElementsByTagName('body')[0];
    if(body){
      body.classList.remove('landing-page');
    }
    
    var navbar = document.getElementsByTagName('nav')[0];
    if(navbar){
      navbar.classList.remove('navbar-transparent');
    }
    
    this.subscriptions.unsubscribe();
  }
}
