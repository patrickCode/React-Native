import { JobPool } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";

export class JobPoolTranslator implements IDbObjectTranslator<JobPool> {
    
    TranslateFromDb(dbObj: any): JobPool {
        return {
            Id: dbObj.Id,
            Name: dbObj.Id,
            JobQueue: JSON.parse(dbObj.JobQueue),
            ActiveJobId: dbObj.ActiveJobId
        }
    }    
    
    TranslateListFromDb(dbObj: any): JobPool[] {
        let jobPools = new Array<JobPool>();
        dbObj.forEach(element => {
            jobPools.push(this.TranslateFromDb(element));
        });
        return jobPools;
    }
    
    TranslateToDbObj(obj: JobPool): any {
        return {
            Id: obj.Id,
            Name: obj.Id,
            JobQueue: JSON.stringify(obj.JobQueue),
            ActiveJobId: obj.ActiveJobId
        }
    }
}