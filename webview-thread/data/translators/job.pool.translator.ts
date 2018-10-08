import { JobPool } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";

export class JobPoolTranslator implements IDbObjectTranslator<JobPool> {
    
    TranslateFromDb(dbObj: any): JobPool {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        return {
            Id: dbObj.Id,
            Name: dbObj.Id,
            JobQueue: JSON.parse(dbObj.JobQueue),
            ActiveJobId: dbObj.ActiveJobId
        }
    }    
    
    TranslateListFromDb(dbObj: any): JobPool[] {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        let jobPools = new Array<JobPool>();
        dbObj.forEach(element => {
            jobPools.push(this.TranslateFromDb(element));
        });
        return jobPools;
    }
    
    TranslateToDbObj(obj: JobPool): any {
        if (obj === undefined || obj === null)
            return null;
        return {
            Id: obj.Id,
            Name: obj.Id,
            JobQueue: JSON.stringify(obj.JobQueue),
            ActiveJobId: obj.ActiveJobId
        }
    }
}