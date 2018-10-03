export class JobStatusTranslator {
    TranslateFromDb(dbObj) {
        return {
            Id: dbObj.Id,
            IsActive: dbObj.IsActive,
            RunHistory: JSON.parse(dbObj.RunHistory)
        };
    }
    TranslateListFromDb(dbObj) {
        let jobStatusList = new Array();
        dbObj.forEach(element => {
            jobStatusList.push(this.TranslateFromDb(element));
        });
        return jobStatusList;
    }
    TranslateToDbObj(obj) {
        return {
            Id: obj.Id,
            IsActive: obj.IsActive,
            RunHistory: JSON.stringify(obj.RunHistory)
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnN0YXR1cy50cmFuc2xhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiam9iLnN0YXR1cy50cmFuc2xhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sT0FBTyxtQkFBbUI7SUFFNUIsZUFBZSxDQUFDLEtBQVU7UUFDdEIsT0FBTztZQUNILEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNaLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO1NBQzNDLENBQUE7SUFDTCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBVTtRQUMxQixJQUFJLGFBQWEsR0FBRyxJQUFJLEtBQUssRUFBYSxDQUFDO1FBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDcEIsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBYztRQUMzQixPQUFPO1lBQ0gsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ1YsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1lBQ3RCLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDN0MsQ0FBQTtJQUNMLENBQUM7Q0FDSiJ9