import { Job } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";

export class JobTranslator implements IDbObjectTranslator<Job> {
    
    TranslateFromDb(dbObj: any): Job {
        return {
            Id: dbObj.Id,
            CreatedOn: new Date(dbObj.CreatedOn),
            JobDefinition: null,
            Name: dbObj.Name,
            Partner: dbObj.Partner,
            Payload: JSON.parse(dbObj.Payload),
            Priority: dbObj.Priority,
            RuntimeSettings: JSON.parse(dbObj.RuntimeSettings)
        };
    }    
    
    TranslateListFromDb(dbObj: any): Job[] {
        let jobs: Array<Job> = new Array<Job>();
        dbObj.forEach(element => {
            jobs.push(this.TranslateFromDb(element));
        });
        return jobs;
    }
    
    TranslateToDbObj(obj: Job): any {
        return {
            Id: obj.Id,
            CreatedOn: obj.CreatedOn.toString(),
            JobDefinition: null,
            Name: obj.Name,
            Partner: obj.Partner,
            Payload: JSON.stringify(obj.Payload),
            Priority: obj.Priority,
            RuntimeSettings: JSON.stringify(obj.RuntimeSettings)
        }
    }
}