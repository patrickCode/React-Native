import { JobStatus } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";

export class JobStatusTranslator implements IDbObjectTranslator<JobStatus> {
    
    TranslateFromDb(dbObj: any): JobStatus {
        if (dbObj === undefined || dbObj === null)
            return null;
        return {
            IsActive: dbObj.IsActive,
            RunHistory: JSON.parse(dbObj.RunHistory)
        }
    }    
    
    TranslateListFromDb(dbObj: any): JobStatus[] {
        if (dbObj === undefined || dbObj === null)
            return null;
        let jobStatusList = new Array<JobStatus>();
        dbObj.forEach(element => {
            jobStatusList.push(this.TranslateFromDb(element));
        });
        return jobStatusList;
    }
    
    TranslateToDbObj(obj: JobStatus): any {
        if (obj === undefined || obj === null)
            return null;
        return {
            IsActive: obj.IsActive,
            RunHistory: JSON.stringify(obj.RunHistory)
        }
    }
}