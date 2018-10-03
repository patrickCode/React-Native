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
            if (this._realm != null && !this._realm.isClosed)
                this._realm.close();
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
    // async Upsert(data: T): Promise<any> {
    //     await AsyncStorage.setItem("Some_Data", `Upsert 1`)
    //     if (!this.IsReamConnected()) {
    //         await AsyncStorage.setItem("Some_Data", `Upsert 2`)
    //         await this.Connect();
    //         await AsyncStorage.setItem("Some_Data", `Upsert 3`)
    //     }
    //     await AsyncStorage.setItem("Some_Data", `Upsert 4`)
    //     let realmObject = this._objectTranslator.TranslateToDbObj(data);
    //     await AsyncStorage.setItem("Some_Data", `Upsert 5`)
    //     //alert(realmObject);
    //     this._realm.write(async () => {
    //         await AsyncStorage.setItem("Some_Data", `Upsert 551`)
    //         this._realm.create(this._realmObjectType, realmObject, true);
    //         await AsyncStorage.setItem("Some_Data", `Upsert 555`)
    //     });
    //     await AsyncStorage.setItem("Some_Data", `Upsert 6`)
    // }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhbG0uZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZWFsbS5kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUkxQixNQUFNLE9BQU8sYUFBYTtJQU90QixZQUFZLGFBQW1DO1FBTHZDLHNCQUFpQixHQUEyQixJQUFJLENBQUM7UUFFakQsbUJBQWMsR0FBeUIsSUFBSSxDQUFDO1FBQzVDLFdBQU0sR0FBVSxJQUFJLENBQUM7UUFHekIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBQ2xELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztJQUN4QyxDQUFDO0lBR0ssT0FBTzs7WUFDVCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRO2dCQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBR3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUMzQixJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZO2dCQUN0QyxNQUFNLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPO2dCQUNuQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxhQUFhO2FBQ25ELENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDO0tBQUE7SUFFTyxlQUFlO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksSUFBSSxD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