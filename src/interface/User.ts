export class User{
    public id:number = -1;
    public account:string = "";
    public password:string = "";
    public role: number = 0;
    public phone:string = "";
    public email:string = "";
    /**
     * 状态，0为正常，1为有书未还，2为黑名单用户
     */
    public status: 0 | 1 | 2 = 0;
    public isUpdate:boolean = false;
    public salary: number = 2000;
    public index:number = -1;
    public isAdd:boolean = false;
    public enrollTime:string = "";
    public passwordLocal:string | undefined = undefined;
    public dept:string = ''
    public statusLocal: '正常' | '异常' = '正常'
}

export class LoginUser extends User {
    checkCode = "";
}

export class RegisterUser extends User {
    ensurePassword = ""
}


