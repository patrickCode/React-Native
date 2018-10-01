export class ProxyService {
    async Get(url): Promise<any> {
        let response = await fetch(url);
        let responseObj = await response.json();
        return responseObj;
    }
}