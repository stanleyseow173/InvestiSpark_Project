export interface LoginDetails{
    username: string
    password: string
}

export interface User{
    id: number
    username: string
    enabled: number
    first_name: string
    last_name: string
    email: string
    roles: [string]
}

export interface UserNavBar{
    email: string;
    firstname: string;
    id: number;
    lastname: string;
    roles: [string];
    username: string
}

export interface ChecklistIdentifier{
    id: string;
    title: string;
}

export class ResearchChecklistItem{
    checked: boolean;
    item: string;
    remarks: string;
    
    constructor(){
        this.checked = false;
        this.item = '';
        this.remarks = '';
    }
}

export class UserFollower{
    userEmail: string;
    followerEmail: string;

    constructor(userEmail: string, followerEmail: string){
        this.userEmail = userEmail;
        this.followerEmail = followerEmail;
    }
}

export interface StocksSearchSnippet{
    symbol: string
    name: string
}

export interface WatchlistStock{
    symbol: string;
    name: string;
    buytarget: number;
    selltarget: number;
}

export interface Watchlist{
    user: string;
    stocks: WatchlistStock[];
}

export interface GetWatchlistStock{
    symbol: string;
    name: string;
    buytarget: number;
    selltarget: number;
    regularMarketPrice: string;
    regularMarketChangePercent: string;
    fiftyTwoWeekHigh: string;
    fiftyTwoWeekLow: string;
}

export interface GetWatchlist{
    user: string;
    stocks: GetWatchlistStock[];
}

export interface StockCurrent{
    price: string
    change: string
    changePercent: string
    day: string
}

export class Note{
    nameSymbol: string
    content: string
    date: string

    constructor(nameSymbol: string, content: string='', date: string=''){
        this.nameSymbol = nameSymbol;
        this.content = content;
        this.date = date;
    }

}

export interface LinkPreviewData{
    url: string;
    title: string;
    description: string;
    imageUrl: string;
}

export interface Post{
    authorEmail: string;
    content: string;
    tag: string;
    category: string;
    timestamp: string;
    symbol: string;
    target: string;
    targetDate: string;
}

export interface Estimation{
    symbol: string;
    target: string;
    targetDate: string;
}

export interface UserStats{
    email: string
    reputation: number
    posts: number
    followers: number
    following: number
    estimates: number
    likes: number
}

export interface StockOverview{
    //overview
    name: string
    description: string
    exchange:string
    symbol: string
    currency: string
    country: string
    sector: string
    industry: string
    //operating stats
    profitmargin: string
    operatingmargin: string
    roa: string
    roe: string
    qtrearningsgrowth: string
    qtrrevenuegrowth: string
    //valuation stats
    peratio: string
    forwardpe: string
    pegratio: string
    divyield: string
    exdivdate: string
    pbratio: string
    psratio: string
    analysttarget: string
    //technical stats
    fiftytwohigh: string
    fiftytwolow: string
    fiftydayma: string
    twohundreddayma: string
    beta: string


}