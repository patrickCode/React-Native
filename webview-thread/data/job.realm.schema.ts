import Realm from "realm";

export const SampleObjSchema: Realm.ObjectSchema = {
    name: "Sample",
    primaryKey: "Id",
    properties: {
        Name: 'string',
        Id: 'string'
    }
}

export const JobStatusSchema: Realm.ObjectSchema = {
    name: "JobStatus",
    properties: {
        RunHistory: 'string',
        IsActive: 'bool'
    }
}


export const JobSchema: Realm.ObjectSchema = {
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
}

export const JobPoolSchema: Realm.ObjectSchema = {
    name: "JobPool",
    primaryKey: "Id",
    properties: {
        Id: 'string',
        JobQueue: 'string',
        ActiveJobId: 'string'
    }
}