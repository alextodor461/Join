export class Task {
    id!: number;
    title!: string;
    description!: string;
    priority!: number;
    state!: number;
    creation_date!: string;
    completion_date!: string | number;
    assignee!: string | number;
    creator!: string | number;
}
