import Realm from 'realm';
import { IDatabase, RealmDbConfiguration, IDbObjectTranslator } from "./database.interface";

export class RealmDatabase<T> implements IDatabase<T> {

    private _objectTranslator: IDbObjectTranslator = null;
    private _realmObjectType: string;
    static RealmInstance: Realm = null;
    

    async Connect(configuration: RealmDbConfiguration): Promise<any> {
        this.validateConfiguration(configuration);
        if (RealmDatabase.RealmInstance == null) {
            RealmDatabase.RealmInstance = await Realm.open({
                path: configuration.DatabaseName,
                schema: configuration.Schemas,
                schemaVersion: configuration.SchemaVersion
            });
            this._objectTranslator = configuration.Translator;
            this._realmObjectType = configuration.Schemas[0].name;
        }
        return RealmDatabase.RealmInstance
    }

    private validateConfiguration(configuration: RealmDbConfiguration) {
        if (configuration.DatabaseName === undefined || configuration.DatabaseName === null)
            throw new Error("The realm database path cannot be empty");
        if (configuration.Schemas === undefined || configuration.Schemas === null || configuration.Schemas.length < 1)
            throw new Error("Schemas need to be defined for accessing Realm DB");
        if (configuration.Schemas[0].primaryKey === undefined || configuration.Schemas[0].primaryKey === null)
            throw new Error("Format of schema is wrong. Currently non-indexed entries are not supported by ESXP. Please add a Primary Key to the schema");
        if (configuration.Schemas[0].name === undefined || configuration.Schemas[0].name === null)
            throw new Error("Format of schema is wrong. The object type name is missing.");
    }

    //Works with the assumption that id field is present in your object
    async Get<T>(id: number | string): Promise<T> {
        let realmObjects = RealmDatabase.RealmInstance.objectForPrimaryKey(this._realmObjectType, id);
        let translatedObjects = this._objectTranslator.TranslateFromDb<T>(realmObjects);
        return translatedObjects;
    }

    async GetAll<T>(): Promise<T[]> {
        let realmObjects = RealmDatabase.RealmInstance.objects(this._realmObjectType);
        let translatedObjects = this._objectTranslator.TranslateListFromDb<T>(realmObjects);
        return translatedObjects;
    }

    async Filter<T>(filterString: string): Promise<T[]> {
        let realmObjects = RealmDatabase.RealmInstance.objects(this._realmObjectType);
        let filteredData = realmObjects.filtered(filterString);
        let translatedObjects = this._objectTranslator.TranslateListFromDb<T>(filteredData);
        return translatedObjects;
    }

    async Upsert<T>(data: T): Promise<any> {
        let realmObject = this._objectTranslator.TranslateToDbObj<T>(data);
        RealmDatabase.RealmInstance.write(() => {
            RealmDatabase.RealmInstance.create(this._realmObjectType, realmObject, true);
        });
    }

    async Delete<T>(id: string | number): Promise<T> {
        let realmObject = RealmDatabase.RealmInstance.objectForPrimaryKey(this._realmObjectType, id);
        let translatedObject = this._objectTranslator.TranslateFromDb<T>(realmObject);
        if (translatedObject !== null && translatedObject !== undefined) {
            RealmDatabase.RealmInstance.write(() => {
                RealmDatabase.RealmInstance.create(this._realmObjectType, realmObject, true);
            });
        }
        return translatedObject;
    }
}