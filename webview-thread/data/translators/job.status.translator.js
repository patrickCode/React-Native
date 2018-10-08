export class JobStatusTranslator {
    TranslateFromDb(dbObj) {
        if (dbObj === undefined || dbObj === null)
            return null;
        return {
            IsActive: dbObj.IsActive,
            RunHistory: JSON.parse(dbObj.RunHistory)
        };
    }
    TranslateListFromDb(dbObj) {
        if (dbObj === undefined || dbObj === null)
            return null;
        let jobStatusList = new Array();
        dbObj.forEach(element => {
            jobStatusList.push(this.TranslateFromDb(element));
        });
        return jobStatusList;
    }
    TranslateToDbObj(obj) {
        if (obj === undefined || obj === null)
            return null;
        return {
            IsActive: obj.IsActive,
            RunHistory: JSON.stringify(obj.RunHistory)
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnN0YXR1cy50cmFuc2xhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiam9iLnN0YXR1cy50cmFuc2xhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sT0FBTyxtQkFBbUI7SUFFNUIsZUFBZSxDQUFDLEtBQVU7UUFDdEIsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLE9BQU87WUFDSCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztTQUMzQyxDQUFBO0lBQ0wsQ0FBQztJQUVELG1CQUFtQixDQUFDLEtBQVU7UUFDMUIsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJO1lBQ3JDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLElBQUksYUFBYSxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7UUFDM0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNwQixhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxHQUFjO1FBQzNCLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssSUFBSTtZQUNqQyxPQUFPLElBQUksQ0FBQztRQUNoQixPQUFPO1lBQ0gsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO1lBQ3RCLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7U0FDN0MsQ0FBQTtJQUNMLENBQUM7Q0FDSiJ9