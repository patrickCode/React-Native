export interface IDatabase<T> {
    Connect(): Promise<any>
    Get(id: any): Promise<T>
    GetAll(): Promise<Array<T>>
    Filter(filterString: string): Promise<Array<T>>
    Upsert(data: T): Promise<any>
    Delete(id: any): Promise<T>
}

export interface DatabaseConfiguration {
    DatabaseName: string,
    Translator: IDbObjectTranslator<any>
}

export interface IDbObjectTranslator<T> { 
    TranslateFromDb(dbObj: any): T
    TranslateListFromDb(dbObj: any): Array<T>
    TranslateToDbObj(obj: T): any
}

//TODO: Should be in a different file
export interface RealmDbConfiguration extends DatabaseConfiguration {
    Schemas: Array<any>,
    SchemaVersion: number
}