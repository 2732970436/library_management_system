import { SalaryRecord } from "@/interface/salaryRecord";
import Result from "@/interface/Result";
import { User } from "@/interface/User";
import { store } from "@/store";
import axios from "axios";
import url from "./network_url";


const salaryUrl = url + "/salaryRecord/salaryRecord"

/**
 *
 * @returns
 */
export function getsalaryRecords(userName:string = store.state.profile.user!.account):Promise<Result<Array<SalaryRecord>>> {
    return axios.get(salaryUrl + `/${userName}`) as any;
}

export function getAllSalaryRecords() {
    return axios.get(salaryUrl) as any;
}


// export function getsalarysByPage(page: number, size:number):{records:Promise<Result<Array<SalaryRecord>>>} {
//     return axios.get(`${salaryUrl}/${page}/${size}`) as any;
// }



export function insertsalaryRecords(salaryRecord:SalaryRecord) {
    return axios({
        url: salaryUrl,
        method: "post",
        data:salaryRecord
    })
}

export function updatesalaryRecords(salaryRecord:SalaryRecord) {
    return axios({
        url: salaryUrl,
        method: "patch",
        data:salaryRecord
    })
}

export function deleteSalaryRecord(salaryRecord: SalaryRecord) {
    return axios({
        url: salaryUrl,
        method: "delete",
        data:salaryRecord
    })
}
