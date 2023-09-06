import axios from "axios";
import url from "./network_url";
import Result from "@/interface/Result";
import { Dept } from "@/interface/dept";

const deptUrl = url + "/dept"


export async function getDepts() {
    return axios.get(deptUrl);
}


/**
 *
 * @returns
 */
export function getDeptsByDeptName(deptName:string):Promise<Result<Array<Dept>>> {
    return axios.get(deptUrl + `/${deptName}`);
}


// export function getdeptsByPage(page: number, size:number):{records:Promise<Result<Array<Dept>>>} {
//     return axios.get(`${deptUrl}/${page}/${size}`) as any;
// }



export function insertDept(dept:Dept) {
    return axios({
        url: deptUrl,
        method: "post",
        data:dept
    })
}

export function updateDept(dept:Dept) {
    return axios({
        url: deptUrl,
        method: "patch",
        data:dept
    })
}

export function deleteDept(dept:Dept) {
    return axios({
        url: deptUrl,
        method: "delete",
        data:dept
    })
}