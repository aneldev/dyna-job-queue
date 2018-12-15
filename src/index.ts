export {
  DynaJobQueue,
  IDynaJobQueueConfig,
  IDynaJobQueueStats,
} from "./DynaJobQueue";

console.error(`
my-module: Import error
    You should import "my-module/web" or "my-module/node" (with lazy  or not) according the runtime environment.
    For typescript, you should import the types from "my-module" but functional code from web or node versions.
    More for how to import with conditional lazy load: https://github.com/aneldev/dyna-ts-module-boilerplate#how-to-import
`);
