export class Dept {
    dept: string;
    managerId: number;
    description: string;
    empNum: number;
    managerName?: string;

    constructor(dept: string = '', managerId: number = -1, description: string = '', empNum: number = 0, managerName?: string) {
        this.dept = dept;
        this.managerId = managerId;
        this.description = description;
        this.empNum = empNum;
        this.managerName = managerName;
    }
}
