export class JobPoolTranslator {
    TranslateFromDb(dbObj) {
        return {
            Id: dbObj.Id,
            Name: dbObj.Id,
            JobQueue: JSON.parse(dbObj.JobQueue),
            ActiveJobId: dbObj.ActiveJobId
        };
    }
    TranslateListFromDb(dbObj) {
        let jobPools = new Array();
        dbObj.forEach(element => {
            jobPools.push(this.TranslateFromDb(element));
        });
        return jobPools;
    }
    TranslateToDbObj(obj) {
        return {
            Id: obj.Id,
            Name: obj.Id,
            JobQueue: JSON.stringify(obj.JobQueue),
            ActiveJobId: obj.ActiveJobId
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnBvb2wudHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5wb29sLnRyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLGlCQUFpQjtJQUUxQixlQUFlLENBQUMsS0FBVTtRQUN0QixPQUFPO1lBQ0gsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ1osSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ2QsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztZQUNwQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7U0FDakMsQ0FBQTtJQUNMLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxLQUFVO1FBQzFCLElBQUksUUFBUSxHQUFHLElBQUksS0FBSyxFQUFXLENBQUM7UUFDcEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNwQixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxHQUFZO1FBQ3pCLE9BQU87WUFDSCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDVixJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDWixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3RDLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVztTQUMvQixDQUFBO0lBQ0wsQ0FBQztDQUNKIn0=