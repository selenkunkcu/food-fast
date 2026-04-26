import { Account, Avatars, Client, ID, TablesDB, Query, Storage } from "react-native-appwrite";
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.selen.foodfast",
    databaseId: '69c63cf800166bb31272',
    bucketId: '69ee306300358fae6f8c',
    userTableId: 'user',
    categoriesTableId: 'categories',
    menuTableId: 'menu',
    customizationsTableId: 'customizations',
    menuCustomizationsTableId: 'menu_customizations',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create({
            userId: ID.unique(),
            email,
            password,
            name,
        });

         if (!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            rowId: ID.unique(),
            data: {
                accountId: newAccount.$id,
                email,
                name,
                avatar: avatarUrl.toString(),
            },
        });

    } catch (e) {
        console.log("e-- ", e)
        throw new Error(e as string);

    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        return  await account.createEmailPasswordSession({
            email,
            password,
        });
    } catch (e) {
        console.log("e-- ", e)
        throw new Error(e as string);


    }
}

export const getCurrentUer = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userTableId,
            queries: [Query.equal("accountId", currentAccount.$id) ]
        })

        if (!currentUser.rows.length) throw Error;
        return currentUser.rows[0];
    } catch (e) {
        console.log("e-- ", e)
        throw new Error(e as string);
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if (category) queries.push(Query.equal("categories", category));
        if (query) queries.push(Query.equal("name", query));

        const menus = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.menuTableId,
            queries: queries,
        });

        return menus.rows;

    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoriesTableId,
        })
    } catch (e) {
        throw new Error(e as string);
    }
}