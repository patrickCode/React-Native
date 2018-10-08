export const SampleObjSchema = {
    name: "Sample",
    primaryKey: "Id",
    properties: {
        Name: 'string',
        Id: 'string'
    }
};
export const JobStatusSchema = {
    name: "JobStatus",
    properties: {
        RunHistory: 'string',
        IsActive: 'bool'
    }
};
export const JobSchema = {
    name: "Job",
    primaryKey: "Id",
    properties: {
        Name: 'string',
        Id: 'string',
        Partner: 'string',
        Priority: 'int',
        RuntimeSettings: 'string',
        Payload: 'string',
        CreatedOn: 'string',
        JobType: 'int',
        Status: 'JobStatus'
    }
};
export const JobPoolSchema = {
    name: "JobPool",
    primaryKey: "Id",
    properties: {
        Id: 'string',
        JobQueue: 'string',
        ActiveJobId: 'string'
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnJlYWxtLnNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5yZWFsbS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUF1QjtJQUMvQyxJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxRQUFRO1FBQ2QsRUFBRSxFQUFFLFFBQVE7S0FDZjtDQUNKLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQXVCO0lBQy9DLElBQUksRUFBRSxXQUFXO0lBQ2pCLFVBQVUsRUFBRTtRQUNSLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLFFBQVEsRUFBRSxNQUFNO0tBQ25CO0NBQ0osQ0FBQTtBQUdELE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBdUI7SUFDekMsSUFBSSxFQUFFLEtBQUs7SUFDWCxVQUFVLEVBQUUsSUFBSTtJQUNoQixVQUFVLEVBQUU7UUFDUixJQUFJLEVBQUUsUUFBUTtRQUNkLEVBQUUsRUFBRSxRQUFRO1FBQ1osT0FBTyxFQUFFLFFBQVE7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixlQUFlLEVBQUUsUUFBUTtRQUN6QixPQUFPLEVBQUUsUUFBUTtRQUNqQixTQUFTLEVBQUUsUUFBUTtRQUNuQixPQUFPLEVBQUUsS0FBSztRQUNkLE1BQU0sRUFBRSxXQUFXO0tBQ3RCO0NBQ0osQ0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBdUI7SUFDN0MsSUFBSSxFQUFFLFNBQVM7SUFDZixVQUFVLEVBQUUsSUFBSTtJQUNoQixVQUFVLEVBQUU7UUFDUixFQUFFLEVBQUUsUUFBUTtRQUNaLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFdBQVcsRUFBRSxRQUFRO0tBQ3hCO0NBQ0osQ0FBQSJ9