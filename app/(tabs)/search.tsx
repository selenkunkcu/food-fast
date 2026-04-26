import {View, Text, Button} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import seed from "@/lib/seed";


export default function Search() {

    return (
        <SafeAreaView>
            <Text>Search</Text>

            <Button title="Seed" onPress={() => seed().catch((error: any) => console.log("Failed to seed the db", error))} />
        </SafeAreaView>
    )
}
