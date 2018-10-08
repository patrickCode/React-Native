import { Job, JobType } from '../job.interface';
import { IDbObjectTranslator } from "../database.interface";
import { JobStatusTranslator } from './job.status.translator';

export class JobTranslator implements IDbObjectTranslator<Job> {

    constructor(
        private _jobStatusTranslator = new JobStatusTranslator()
    ) { }
    
    
    TranslateFromDb(dbObj: any): Job {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        return {
            Id: dbObj.Id,
            CreatedOn: new Date(dbObj.CreatedOn),
            JobDefinition: null,
            Name: dbObj.Name,
            Partner: dbObj.Partner,
            Payload: JSON.parse(dbObj.Payload),
            Priority: dbObj.Priority,
            RuntimeSettings: JSON.parse(dbObj.RuntimeSettings),
            JobType: <JobType>dbObj.JobType,
            Status: this._jobStatusTranslator.TranslateFromDb(dbObj.Status)
        };
    }    
    
    TranslateListFromDb(dbObj: any): Job[] {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        let jobs: Array<Job> = new Array<Job>();
        dbObj.forEach(element => {
            jobs.push(this.TranslateFromDb(element));
        });
        return jobs;
    }
    
    TranslateToDbObj(obj: Job): any {
        if (obj === undefined || obj === undefined)
            return null;
        return {
            Id: obj.Id,
            CreatedOn: obj.CreatedOn.toString(),
            JobDefinition: null,
            Name: obj.Name,
            Partner: obj.Partner,
            Payload: JSON.stringify(obj.Payload),
            Priority: obj.Priority,
            RuntimeSettings: JSON.stringify(obj.RuntimeSettings),
            JobType: obj.JobType,
            Status: this._jobStatusTranslator.TranslateToDbObj(obj.Status)
        }
    }
}