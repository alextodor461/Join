import { User } from "./user"

export class Task {
    title!: string;
    description!: string;
    priority!: number;
    state!: number;
    creation_date!: string;
    completion_date!: string;
    assignee!: User;
    creator!: User;
}