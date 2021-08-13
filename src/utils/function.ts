import * as constants from './constants';
import * as interfaces from './interfaces';

export function createUserDisplayData(user:any):interfaces.UserDisplayInf{
    return{
        id: user._id,
        email: user.email,
        provider: user.provider,
        created_at: new Date(user.created_at).toISOString()
    }

}