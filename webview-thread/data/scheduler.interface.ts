import { RuntimeSetting, IJobPoolManager, Job } from "./job.interface";

export interface SchedulerRuntimeSettings {
    Jobs: Array<Job>,
    JobPoolManager: IJobPoolManager,
    PoolRuntimeSettings: RuntimeSetting
}