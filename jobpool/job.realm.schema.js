export const JobSchema = {
    name: "Job",
    primaryKey: "Id",
    properties: {
        Name: 'string',
        Id: 'string',
        Partner: 'string',
        Priority: 'number',
        RuntimeSettings: 'string',
        Payload: 'string',
        CreatedOn: 'string'
    }
};
export const JobStatusSchema = {
    name: "JobStatus",
    primaryKey: "Id",
    properties: {
        Id: 'string',
        RunHistory: 'string',
        IsActive: 'boolean'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnJlYWxtLnNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5yZWFsbS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUF1QjtJQUN6QyxJQUFJLEVBQUUsS0FBSztJQUNYLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxRQUFRO1FBQ2QsRUFBRSxFQUFFLFFBQVE7UUFDWixPQUFPLEVBQUUsUUFBUTtRQUNqQixRQUFRLEVBQUUsUUFBUTtRQUNsQixlQUFlLEVBQUUsUUFBUTtRQUN6QixPQUFPLEVBQUUsUUFBUTtRQUNqQixTQUFTLEVBQUUsUUFBUTtLQUN0QjtDQUNKLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQXVCO0lBQy9DLElBQUksRUFBRSxXQUFXO0lBQ2pCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRTtRQUNSLEVBQUUsRUFBRSxRQUFRO1FBQ1osVUFBVSxFQUFFLFFBQVE7UUFDcEIsUUFBUSxFQUFFLFNBQVM7S0FDdEI7Q0FDSixDQUFBO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUF1QjtJQUM3QyxJQUFJLEVBQUUsU0FBUztJQUNmLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRTtRQUNSLEVBQUUsRUFBRSxRQUFRO1FBQ1osUUFBUSxFQUFFLFFBQVE7UUFDbEIsV0FBVyxFQUFFLFFBQVE7S0FDeEI7Q0FDSixDQUFBIn0=