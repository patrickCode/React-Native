import { JobStatusTranslator } from './job.status.translator';
export class JobTranslator {
    constructor(_jobStatusTranslator = new JobStatusTranslator()) {
        this._jobStatusTranslator = _jobStatusTranslator;
    }
    TranslateFromDb(dbObj) {
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
            JobType: dbObj.JobType,
            Status: this._jobStatusTranslator.TranslateFromDb(dbObj.Status)
        };
    }
    TranslateListFromDb(dbObj) {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        let jobs = new Array();
        dbObj.forEach(element => {
            jobs.push(this.TranslateFromDb(element));
        });
        return jobs;
    }
    TranslateToDbObj(obj) {
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
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnRyYW5zbGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqb2IudHJhbnNsYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU5RCxNQUFNLE9BQU8sYUFBYTtJQUV0QixZQUNZLHVCQUF1QixJQUFJLG1CQUFtQixFQUFFO1FBQWhELHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBNEI7SUFDeEQsQ0FBQztJQUdMLGVBQWUsQ0FBQyxLQUFVO1FBQ3RCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssU0FBUztZQUMxQyxPQUFPLElBQUksQ0FBQztRQUNoQixPQUFPO1lBQ0gsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ1osU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEMsYUFBYSxFQUFFLElBQUk7WUFDbkIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1lBQ2xELE9BQU8sRUFBVyxLQUFLLENBQUMsT0FBTztZQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1NBQ2xFLENBQUM7SUFDTixDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBVTtRQUMxQixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVM7WUFDMUMsT0FBTyxJQUFJLENBQUM7UUFDaEIsSUFBSSxJQUFJLEdBQWUsSUFBSSxLQUFLLEVBQU8sQ0FBQztRQUN4QyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEdBQVE7UUFDckIsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxTQUFTO1lBQ3RDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLE9BQU87WUFDSCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDVixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7WUFDbkMsYUFBYSxFQUFFLElBQUk7WUFDbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO1lBQ2QsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3BCLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDcEMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1lBQ3RCLGVBQWUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDcEQsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPO1lBQ3BCLE1BQU0sRUFBRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztTQUNqRSxDQUFBO0lBQ0wsQ0FBQztDQUNKIn0=