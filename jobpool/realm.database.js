var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Realm from 'realm';
export class RealmDatabase {
    constructor() {
        this._objectTranslator = null;
    }
    Connect(configuration) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateConfiguration(configuration);
            if (RealmDatabase.RealmInstance == null) {
                RealmDatabase.RealmInstance = yield Realm.open({
                    path: configuration.DatabaseName,
                    schema: configuration.Schemas,
                    schemaVersion: configuration.SchemaVersion
                });
                this._objectTranslator = configuration.Translator;
                this._realmObjectType = configuration.Schemas[0].name;
            }
            return RealmDatabase.RealmInstance;
        });
    }
    validateConfiguration(configuration) {
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
    Get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let realmObjects = RealmDatabase.RealmInstance.objectForPrimaryKey(this._realmObjectType, id);
            let translatedObjects = this._objectTranslator.TranslateFromDb(realmObjects);
            return translatedObjects;
        });
    }
    GetAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let realmObjects = RealmDatabase.RealmInstance.objects(this._realmObjectType);
            let translatedObjects = this._objectTranslator.TranslateListFromDb(realmObjects);
            return translatedObjects;
        });
    }
    Filter(filterString) {
        return __awaiter(this, void 0, void 0, function* () {
            let realmObjects = RealmDatabase.RealmInstance.objects(this._realmObjectType);
            let filteredData = realmObjects.filtered(filterString);
            let translatedObjects = this._objectTranslator.TranslateListFromDb(filteredData);
            return translatedObjects;
        });
    }
    Upsert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let realmObject = this._objectTranslator.TranslateToDbObj(data);
            RealmDatabase.RealmInstance.write(() => {
                RealmDatabase.RealmInstance.create(this._realmObjectType, realmObject, true);
            });
        });
    }
    Delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let realmObject = RealmDatabase.RealmInstance.objectForPrimaryKey(this._realmObjectType, id);
            let translatedObject = this._objectTranslator.TranslateFromDb(realmObject);
            if (translatedObject !== null && translatedObject !== undefined) {
                RealmDatabase.RealmInstance.write(() => {
                    RealmDatabase.RealmInstance.create(this._realmObjectType, realmObject, true);
                });
            }
            return translatedObject;
        });
    }
}
RealmDatabase.RealmInstance = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbG0uZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWFsbS5kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUcxQixNQUFNLE9BQU8sYUFBYTtJQUExQjtRQUVZLHNCQUFpQixHQUEyQixJQUFJLENBQUM7SUFtRTdELENBQUM7SUE5RFMsT0FBTyxDQUFDLGFBQW1DOztZQUM3QyxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDMUMsSUFBSSxhQUFhLENBQUMsYUFBYSxJQUFJLElBQUksRUFBRTtnQkFDckMsYUFBYSxDQUFDLGFBQWEsR0FBRyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUM7b0JBQzNDLElBQUksRUFBRSxhQUFhLENBQUMsWUFBWTtvQkFDaEMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxPQUFPO29CQUM3QixhQUFhLEVBQUUsYUFBYSxDQUFDLGFBQWE7aUJBQzdDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ3pEO1lBQ0QsT0FBTyxhQUFhLENBQUMsYUFBYSxDQUFBO1FBQ3RDLENBQUM7S0FBQTtJQUVPLHFCQUFxQixDQUFDLGFBQW1DO1FBQzdELElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxTQUFTLElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxJQUFJO1lBQy9FLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztRQUMvRCxJQUFJLGFBQWEsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLGFBQWEsQ0FBQyxPQUFPLEtBQUssSUFBSSxJQUFJLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7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