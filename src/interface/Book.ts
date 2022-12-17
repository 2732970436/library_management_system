export interface Book {
  id:number,
  bookName:string,
  store:number,
  remain:number;
  author:string,
  type:string,
  price:number,
  index:number,
  isUpdate:boolean,
  content:string,
  isAdd:boolean;
}
/**
 * id为-1时表示此数据是新增数据，暂无id
 */

export class BookC implements Book {
  public id:number = -1;
  public bookName:string = "";
  public store:number = 0;
  public author:string = "";
  public price:number = 0.00;
  public index:number = 0;
  public remain:number = 0;
  public type:string = "暂定";
  public isUpdate:boolean = true;
  public content:string = "";
  public isAdd: boolean = true;

 
 }



 

