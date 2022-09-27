export class Task {
    id!: number;
    title!: string;
    description!: string;
    priority!: string;
    state!: string;
    creation_date!: string;
    completion_date!: string | number;
    assignee!: string | number;
    creator!: string | number;
}
