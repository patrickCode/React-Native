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
    constructor(configuration) {
        this._objectTranslator = null;
        this._configuration = null;
        this._realm = null;
        this.validateConfiguration(configuration);
        this._objectTranslator = configuration.Translator;
        this._realmObjectType = configuration.Schemas[0].name;
        this._configuration = configuration;
    }
    Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._realm != null && !this._realm.isClosed) {
                this._realm.close();
            }
            this._realm = yield Realm.open({
                path: this._configuration.DatabaseName,
                schema: this._configuration.Schemas,
                schemaVersion: this._configuration.SchemaVersion
            });
            return this._realm;
        });
    }
    IsReamConnected() {
        if (this._realm === undefined || this._realm === null)
            return false;
        return !this._realm.isClosed;
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
            if (!this.IsReamConnected())
                yield this.Connect();
            let realmObjects = this._realm.objectForPrimaryKey(this._realmObjectType, id);
            let translatedObjects = this._objectTranslator.TranslateFromDb(realmObjects);
            return translatedObjects;
        });
    }
    GetAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.IsReamConnected())
                yield this.Connect();
            let realmObjects = this._realm.objects(this._realmObjectType);
            let translatedObjects = this._objectTranslator.TranslateListFromDb(realmObjects);
            return translatedObjects;
        });
    }
    Filter(filterString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.IsReamConnected())
                yield this.Connect();
            let realmObjects = this._realm.objects(this._realmObjectType);
            let filteredData = realmObjects.filtered(filterString);
            let translatedObjects = this._objectTranslator.TranslateListFromDb(filteredData);
            return translatedObjects;
        });
    }
    Upsert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.IsReamConnected()) {
                yield this.Connect();
            }
            let realmObject = this._objectTranslator.TranslateToDbObj(data);
            this._realm.write(() => __awaiter(this, void 0, void 0, function* () {
                this._realm.create(this._realmObjectType, realmObject, true);
            }));
        });
    }
    Delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.IsReamConnected())
                yield this.Connect();
            let realmObject = this._realm.objectForPrimaryKey(this._realmObjectType, id);
            let translatedObject = this._objectTranslator.TranslateFromDb(realmObject);
            if (translatedObject !== null && translatedObject !== undefined) {
                this._realm.write(() => {
                    this._realm.create(this._realmObjectType, realmObject, true);
                });
            }
            return translatedObject;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbG0uZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWFsbS5kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUcxQixNQUFNLE9BQU8sYUFBYTtJQU90QixZQUFZLGFBQW1DO1FBTHZDLHNCQUFpQixHQUEyQixJQUFJLENBQUM7UUFFakQsbUJBQWMsR0FBeUIsSUFBSSxDQUFDO1FBQzVDLFdBQU0sR0FBVSxJQUFJLENBQUM7UUFHekIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBQ2xELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUN4QyxDQUFDO0lBR0ssT0FBTzs7WUFDVCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDdkI7WUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDM0IsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWTtnQkFDdEMsTUFBTSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTztnQkFDbkMsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYTthQUNuRCxDQUFDLENBQUM7WUFFSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztLQUFBO0lBRU8sZUFBZTtRQUNuQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJ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