export type Id = string | number;

export interface menuItemsProps {
    openMenu: string | null;
    menuToggle: (menu: string) => void;
  }

export type Column = {
    id: Id;
    title: string;
    tasks: Task []
    boardId: string
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
    isFavorite: boolean;
}

export interface FavBoard {
    id: string;
    title: string;
    backgroundUrl: string;
    lists: Column[]; 
    imageUrls: string[];
    isFavorite: boolean;
}