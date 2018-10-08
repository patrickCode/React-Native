export class Timer {
    Run(timeout: number): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
               resolve(); 
            }, timeout);
        })
    }
    
    // private runTimer(timeout: number): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve();
    //         }, timeout);
    //     })
    // }
}