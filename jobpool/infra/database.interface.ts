export interface IDatabase<T> {
    Connect(configuration: DatabaseConfiguration): Promise<any>
    Get<T>(id: any): Promise<T>
    GetAll<T>(): Promise<Array<T>>
    Filter<T>(filterString: string): Promise<Array<T>>
    Upsert<T>(data: T): Promise<any>
    Delete<T>(id: any): Promise<T>
}

export interface DatabaseConfiguration {
    DatabaseName: string,
    Translator: IDbObjectTranslator
}

export interface IDbObjectTranslator { 
    TranslateFromDb<T>(dbObj: any): T
    TranslateListFromDb<T>(dbObj: any): Array<T>
    TranslateToDbObj<T>(obj: T): any
}

//TODO: Should be in a different file
export interface RealmDbConfiguration extends DatabaseConfiguration {
    Schemas: Array<any>,
    SchemaVersion: number
}