import Realm from "realm";

export const JobSchema: Realm.ObjectSchema = {
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
}

export const JobStatusSchema: Realm.ObjectSchema = {
    name: "JobStatus",
    primaryKey: "Id",
    properties: {
        Id: 'string',
        RunHistory: 'string',
        IsActive: 'boolean'
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