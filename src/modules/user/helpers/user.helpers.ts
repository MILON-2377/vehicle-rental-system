

interface IQueryHelperRes {
    usersKeys: string[];
    userValues: string[];
    count: number;
}

export default class UserHelper {
    public static queryHelper = (user: Record<string, any>):IQueryHelperRes  => {
        const userEntries = Object.entries(user);
        const usersKeys: string [] = [];
        const userValues: string[] = [];
        let count = 1;

        for(const [key, value] of userEntries){
            if(value !== undefined){
                usersKeys.push(`${key}=$${count}`);
                userValues.push(value);
                count++;
            }
        }

        return {usersKeys, userValues, count};
    }
}