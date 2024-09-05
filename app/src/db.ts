/**
* Example of using Dexie with TypeScript
*/
import Dexie, {type EntityTable} from "dexie";

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    [key: string]: string | number;
}

const db = new Dexie("myDb") as Dexie & {
    users: EntityTable<User, 'id'>;
}
db.version(1).stores({
    users: "++id, name, username, email, phone, website",
})

const addUser = async (user: User) => {
    const newUser = {
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
    }
    try {
        await db.users.add(newUser);
    } catch (error) { 
        console.error(error);
    }
}

const getUsers = async () => {
    try {
        return await db.users.toArray();
    } catch (error) {
        console.error(error);
    }
}

const queryWhere = async (key: string, value: string) => {
    try {
        return await db.users.filter((user: User)=>{
            return (user[key] as string).indexOf(value) !== -1;
        }).toArray();
    } catch (error) {
        console.error(error);
    }
}

const deleteAll = async () => {
    try {
        await db.users.clear();
    } catch (error) {
        console.error(error);
    }
}

export type {User};
export {db, addUser, getUsers, queryWhere, deleteAll};
 