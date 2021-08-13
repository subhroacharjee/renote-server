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
