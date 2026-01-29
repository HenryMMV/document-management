import { Query } from './query';

export interface QueryHandler<Q extends Query<Result>, Result> {
  execute(query: Q): Promise<Result>;
}
