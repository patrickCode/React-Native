export class JobTranslator {
    TranslateFromDb(dbObj) {
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
    TranslateListFromDb(dbObj) {
        let jobs = new Array();
        dbObj.forEach(element => {
            jobs.push(this.TranslateFromDb(element));
        });
        return jobs;
    }
    TranslateToDbObj(obj) {
        return {
            Id: obj.Id,
            CreatedOn: obj.CreatedOn.toString(),
            JobDefinition: null,
            Name: obj.Name,
            Partner: obj.Partner,
            Payload: JSON.stringify(obj.Payload),
            Priority: obj.Priority,
            RuntimeSettings: JSON.stringify(obj.RuntimeSettings)
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnRyYW5zbGF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqb2IudHJhbnNsYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLE9BQU8sYUFBYTtJQUV0QixlQUFlLENBQUMsS0FBVTtRQUN0QixPQUFPO1lBQ0gsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ1osU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDcEMsYUFBYSxFQUFFLElBQUk7WUFDbkIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ2xDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixlQUFlLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1NBQ3JELENBQUM7SUFDTixDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBVTtRQUMxQixJQUFJLElBQUksR0FBZSxJQUFJLEtBQUssRUFBTyxDQUFDO1FBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBUTtRQUNyQixPQUFPO1lBQ0gsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ25DLGFBQWEsRUFBRSxJQUFJO1lBQ25CLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtZQUNkLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztZQUNwQixPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ3BDLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTtZQUN0QixlQUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO1NBQ3ZELENBQUE7SUFDTCxDQUFDO0NBQ0oifQ==