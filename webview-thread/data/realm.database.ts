import Realm from 'realm';
import { IDatabase, RealmDbConfiguration, IDbObjectTranslator } from "./database.interface";

export class RealmDatabase<T> implements IDatabase<T> {

    private _objectTranslator: IDbObjectTranslator<T> = null;
    private _realmObjectType: string;
    private _configuration: RealmDbConfiguration = null;
    private _realm: Realm = null;

    constructor(configuration: RealmDbConfiguration) {
        this.validateConfiguration(configuration);
        this._objectTranslator = configuration.Translator;
        this._realmObjectType = configuration.Schemas[0].name;
        this._configuration = configuration;
    }


    async Connect(): Promise<any> {
        if (this._realm != null && !this._realm.isClosed) {
            this._realm.close();
        }

        this._realm = await Realm.open({
            path: this._configuration.DatabaseName,
            schema: this._configuration.Schemas,
            schemaVersion: this._configuration.SchemaVersion
        });

        return this._realm;
    }

    private IsReamConnected(): boolean {
        if (this._realm === undefined || this._realm === null)
            return false;
        return !this._realm.isClosed;
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
    async Get(id: number | string): Promise<T> {
        if (!this.IsReamConnected())
            await this.Connect();
        let realmObjects = this._realm.objectForPrimaryKey(this._realmObjectType, id);
        let translatedObjects = this._objectTranslator.TranslateFromDb(realmObjects);
        return translatedObjects;
    }

    async GetAll(): Promise<T[]> {
        if (!this.IsReamConnected())
            await this.Connect();

        let realmObjects = this._realm.objects(this._realmObjectType);
        let translatedObjects = this._objectTranslator.TranslateListFromDb(realmObjects);
        return translatedObjects;
    }

    async Filter(filterString: string): Promise<T[]> {
        if (!this.IsReamConnected())
            await this.Connect();

        let realmObjects = this._realm.objects(this._realmObjectType);
        let filteredData = realmObjects.filtered(filterString);
        let translatedObjects = this._objectTranslator.TranslateListFromDb(filteredData);
        return translatedObjects;
    }

    async Upsert(data: T): Promise<any> {
        if (!this.IsReamConnected()) {
            await this.Connect();
        }

        let realmObject = this._objectTranslator.TranslateToDbObj(data);
        this._realm.write(async () => {
            this._realm.create(this._realmObjectType, realmObject, true);
        });
    }

    async Delete(id: string | number): Promise<T> {
        if (!this.IsReamConnected())
            await this.Connect();

        let realmObject = this._realm.objectForPrimaryKey(this._realmObjectType, id);
        let translatedObject = this._objectTranslator.TranslateFromDb(realmObject);
        if (translatedObject !== null && translatedObject !== undefined) {
            this._realm.write(() => {
                this._realm.create(this._realmObjectType, realmObject, true);
            });
        }
        return translatedObject;
    }
}