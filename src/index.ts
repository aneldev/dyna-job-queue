export {
  DynaJobQueue,
  IDynaJobQueueConfig,
  IDynaJobQueueStats,
} from "./DynaJobQueue";

console.error(`
dyna-job-queue: Import error
    You should import "dyna-job-queue/web" or "dyna-job-queue/node" (with lazy  or not) according the runtime environment.
    For typescript, you should import the types from "dyna-job-queue" but functional code from web or node versions.
    More for how to import with conditional lazy load: https://github.com/aneldev/dyna-ts-module-boilerplate#how-to-import
`);
