export interface borrowRecord {
     borrowDaysLocal: number;
      id:number;
      bookId:number;
      bookName:string
      adminId:number;
      userId:number;
      userName:string;
      startTime:string;
      startTimeLocal:string
      returnStatus:number;
      borrowDays:number;
      remainDays:number;
      remainDaysLocal:number;
      returnTime:string;
      /**
       * 审批进度，0为待审批，1为审批通过，2为审批未被批准
       */
      approvalStatus:0 | 1 | 2;
      approvalStatusLocal:"待审批" | "审批通过" | "未被批准"
}

export interface Query {
      user?: number | null,
      book?: number | null,
}
    