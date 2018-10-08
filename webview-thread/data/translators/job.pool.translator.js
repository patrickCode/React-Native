export class JobPoolTranslator {
    TranslateFromDb(dbObj) {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        return {
            Id: dbObj.Id,
            Name: dbObj.Id,
            JobQueue: JSON.parse(dbObj.JobQueue),
            ActiveJobId: dbObj.ActiveJobId
        };
    }
    TranslateListFromDb(dbObj) {
        if (dbObj === undefined || dbObj === undefined)
            return null;
        let jobPools = new Array();
        dbObj.forEach(element => {
            jobPools.push(this.TranslateFromDb(element));
        });
        return jobPools;
    }
    TranslateToDbObj(obj) {
        if (obj === undefined || obj === null)
            return null;
        return {
            Id: obj.Id,
            Name: obj.Id,
            JobQueue: JSON.stringify(obj.JobQueue),
            ActiveJobId: obj.ActiveJobId
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLnBvb2wudHJhbnNsYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImpvYi5wb29sLnRyYW5zbGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsTUFBTSxPQUFPLGlCQUFpQjtJQUUxQixlQUFlLENBQUMsS0FBVTtRQUN0QixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVM7WUFDMUMsT0FBTyxJQUFJLENBQUM7UUFDaEIsT0FBTztZQUNILEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNaLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNkLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDcEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQ2pDLENBQUE7SUFDTCxDQUFDO0lBRUQsbUJBQW1CLENBQUMsS0FBVTtRQUMxQixJQUFJLEtBQUssS0FBSyxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVM7WUFDMUMsT0FBTyxJQUFJLENBQUM7UUFDaEIsSUFBSSxRQUFRLEdBQUcsSUFBSSxLQUFLLEVBQVcsQ0FBQztRQUNwQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELGdCQUFnQixDQUFDLEdBQVk7UUFDekIsSUFBSSxHQUFHLEtBQUssU0FBUyxJQUFJLEdBQUcsS0FBSyxJQUFJO1lBQ2pDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLE9BQU87WUFDSCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDVixJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDWixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO1lBQ3RDLFdBQVcsRUFBRSxHQUFHLENBQUMsV0FBVztTQUMvQixDQUFBO0lBQ0wsQ0FBQztDQUNKIn0=