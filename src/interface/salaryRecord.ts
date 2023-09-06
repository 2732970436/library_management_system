export class SalaryRecord {
    id: number;
    empName: string;
    totalWage: number;
    netSalary: number;
    salaryMonth: string;
    bonus?: number;

    constructor(id = -1, empName = '', totalWage = 0, netSalary = 0, salaryMonth = '') {
        this.id = id;
        this.empName = empName;
        this.totalWage = totalWage;
        this.netSalary = netSalary;
        this.salaryMonth = salaryMonth;
    }
}
