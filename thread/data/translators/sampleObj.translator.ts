import { SampleObj } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";

export class SampleObjTranslator implements IDbObjectTranslator<SampleObj> {
    
    TranslateFromDb(dbObj: any): SampleObj {
        return {
            Id: dbObj.Id,
            Name: dbObj.Name
        }
    }    
    
    TranslateListFromDb(dbObj: any): SampleObj[] {
        let jobPools = new Array<SampleObj>();
        dbObj.forEach(element => {
            jobPools.push(this.TranslateFromDb(element));
        });
        return jobPools;
    }
    
    TranslateToDbObj(obj: SampleObj): any {
        return {
            Id: obj.Id,
            Name: obj.Name
        }
    }
}