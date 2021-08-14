export interface UserDataInterface {
    email: string
    password?: string
    provider: string
    uid?:string
    created_at:Date
};

export interface UserDisplayInf {
    id: string
    email: string
    provider: string,
    created_at:string
}

export interface RespINF {
    [key:string]:any
}

export interface NotesDataInterface {
    user: string
    title: string
    body?: string
    created_at: Date
}

export interface NotesDisplayInterface {
    id: string
    title: string
    body?: string
    created_at: Date
}
