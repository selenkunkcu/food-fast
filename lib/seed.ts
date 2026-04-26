import {ID, Query} from "react-native-appwrite";
import { appwriteConfig, tablesDB, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(tableId: string): Promise<void> {
    const result = await tablesDB.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId,
        queries: [Query.limit(5000)],
    });

    await Promise.all(
        result.rows.map((row) =>
            tablesDB.deleteRow({
                databaseId: appwriteConfig.databaseId,
                tableId,
                rowId: row.$id,
            })
        )
    );
}

async function clearStorage(): Promise<void> {
    const result = await storage.listFiles({
        bucketId: appwriteConfig.bucketId,
    });

    await Promise.all(
        result.files.map((file) =>
            storage.deleteFile({
                bucketId: appwriteConfig.bucketId,
                fileId: file.$id,
            })
        )
    );
}
/*
async function uploadImageToStorage(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;

    const file = {
        name: fileName,
        type: blob.type || "image/jpeg",
        size: blob.size,
        uri: imageUrl,
    } as any;

    const uploadedFile = await storage.createFile({
        bucketId: appwriteConfig.bucketId,
        fileId: ID.unique(),
        file,
    });

    const fileUrl = storage.getFileViewURL(
        appwriteConfig.bucketId,
        uploadedFile.$id
    );

    return fileUrl.toString();
}*/

async function uploadImageToStorage(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;

    const file = new File([blob], fileName, {
        type: blob.type || "image/jpeg",
    });

    const uploadedFile = await storage.createFile({
        bucketId: appwriteConfig.bucketId,
        fileId: ID.unique(),
        file,
    });

    const fileUrl = storage.getFileViewURL(
        appwriteConfig.bucketId,
        uploadedFile.$id
    );

    return fileUrl.toString();
}



async function seed(): Promise<void> {
    await clearAll(appwriteConfig.menuCustomizationsTableId);
    await clearAll(appwriteConfig.menuTableId);
    await clearAll(appwriteConfig.customizationsTableId);
    await clearAll(appwriteConfig.categoriesTableId);
    await clearStorage();

    const categoryMap: Record<string, string> = {};

    for (const category of data.categories) {
        const row = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoriesTableId,
            rowId: ID.unique(),
            data: {
                name: category.name,
                description: category.description,
            },
        });

        categoryMap[category.name] = row.$id;
    }

    const customizationMap: Record<string, string> = {};

    for (const customization of data.customizations) {
        const row = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.customizationsTableId,
            rowId: ID.unique(),
            data: {
                name: customization.name,
                price: customization.price,
                type: customization.type,
            },
        });

        customizationMap[customization.name] = row.$id;
    }

    const menuMap: Record<string, string> = {};

    for (const item of data.menu) {
        const uploadedImageUrl = await uploadImageToStorage(item.image_url);

        const row = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.menuTableId,
            rowId: ID.unique(),
            data: {
                name: item.name,
                description: item.description,
                image_url: uploadedImageUrl,
                price: item.price,
                rating: item.rating,
                calories: item.calories,
                protein: item.protein,
                categories: categoryMap[item.category_name],
            },
        });

        menuMap[item.name] = row.$id;

        for (const customizationName of item.customizations) {
            await tablesDB.createRow({
                databaseId: appwriteConfig.databaseId,
                tableId: appwriteConfig.menuCustomizationsTableId,
                rowId: ID.unique(),
                data: {
                    menu: row.$id,
                    customizations: customizationMap[customizationName],
                },
            });
        }
    }

    console.log("Seeding complete.");
}

export default seed;