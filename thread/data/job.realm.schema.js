export const SampleObjSchema = {
    name: "Sample",
    primaryKey: "Id",
    properties: {
        Name: 'string',
        Id: 'string'
    }
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnJlYWxtLnNjaGVtYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5yZWFsbS5zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUF1QjtJQUMvQyxJQUFJLEVBQUUsUUFBUTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxRQUFRO1FBQ2QsRUFBRSxFQUFFLFFBQVE7S0FDZjtDQUNKLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQXVCO0lBQ3pDLElBQUksRUFBRSxLQUFLO0lBQ1gsVUFBVSxFQUFFLElBQUk7SUFDaEIsVUFBVSxFQUFFO1FBQ1IsSUFBSSxFQUFFLFFBQVE7UUFDZCxFQUFFLEVBQUUsUUFBUTtRQUNaLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLGVBQWUsRUFBRSxRQUFRO1FBQ3pCLE9BQU8sRUFBRSxRQUFRO1FBQ2pCLFNBQVMsRUFBRSxRQUFRO0tBQ3RCO0NBQ0osQ0FBQTtBQUVELE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBdUI7SUFDL0MsSUFBSSxFQUFFLFdBQVc7SUFDakIsVUFBVSxFQUFFLElBQUk7SUFDaEIsVUFBVSxFQUFFO1FBQ1IsRUFBRSxFQUFFLFFBQVE7UUFDWixVQUFVLEVBQUUsUUFBUTtRQUNwQixRQUFRLEVBQUUsU0FBUztLQUN0QjtDQUNKLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQXVCO0lBQzdDLElBQUksRUFBRSxTQUFTO0lBQ2YsVUFBVSxFQUFFLElBQUk7SUFDaEIsVUFBVSxFQUFFO1FBQ1IsRUFBRSxFQUFFLFFBQVE7UUFDWixRQUFRLEVBQUUsUUFBUTtRQUNsQixXQUFXLEVBQUUsUUFBUTtLQUN4QjtDQUNKLENBQUEifQ==