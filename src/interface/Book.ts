export interface Book {
  id:number,
  bookname:string,
  store:number,
  author:string,
  price:number,
  index:number,
  isUpdate:boolean,
  content:string,
  isAdd:boolean;
}

export class BookC implements Book {
  public id:number;
  public bookname:string;
  public store:number;
  public author:string;
  public price:number;
  public index:number;
  public isUpdate:boolean;
  public content:string;
  public isAdd: boolean = false;
 
  constructor(id:number,book:string,store:number,author:string,price:number,index:number,isUpdate:boolean,content:string) {
    this.id = id;
    this.bookname = book;
    this.store = store;
    this.author = author;
    this.price = price;
    this.index = index;
    this.isUpdate = isUpdate;
    this.content = content
  }
 }



 

