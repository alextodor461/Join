export class Task {
    id!: number; //Determined by the backend.
    title!: string;
    description!: string;
    priority!: number;
    state!: number;
    creation_date!: string;
    completion_date!: string;
    assignee!: string | number;
    creator!: string | number;
}
