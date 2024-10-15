export type Id = string | number;

export type Column = {
    id: Id;
    title: string;
    tasks: Task []
}

export type Task = {
    id: Id;
    columnId: Id;
    content: string;
}

export interface Board {
    id: string;
    title: string;
    backgroundUrl: string;
    lists: Column[]; 
    imageUrls: string[];
}