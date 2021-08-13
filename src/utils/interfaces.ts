export interface UserDataInterface {
    email: string
    password?: string
    provider: string
    created_at:Date
}

export interface RespINF {
    [key:string]:[value:any]
}