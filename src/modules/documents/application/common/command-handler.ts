import { Command } from './command';

export interface CommandHandler<C extends Command<Result>, Result> {
  execute(command: C): Promise<Result>;
}
