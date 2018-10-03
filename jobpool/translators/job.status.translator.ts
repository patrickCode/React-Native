import { JobStatus } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";

export class JobStatusTranslator implements IDbObjectTranslator<JobStatus> {
    
    TranslateFromDb(dbObj: any): JobStatus {
        return {
            Id: dbObj.Id,
            IsActive: dbObj.IsActive,
            RunHistory: JSON.parse(dbObj.RunHistory)
        }
    }    
    
    TranslateListFromDb(dbObj: any): JobStatus[] {
        let jobStatusList = new Array<JobStatus>();
        dbObj.forEach(element => {
            jobStatusList.push(this.TranslateFromDb(element));
        });
        return jobStatusList;
    }
    
    TranslateToDbObj(obj: JobStatus): any {
        return {
            Id: obj.Id,
            IsActive: obj.IsActive,
            RunHistory: JSON.stringify(obj.RunHistory)
        }
    }
}