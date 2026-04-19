import {SafeAreaView} from "react-native-safe-area-context";
import {FlatList, View, Pressable, Text, Image, TouchableOpacity} from "react-native";
import {Fragment} from "react";
import cn from 'clsx'
import CartButton from "@/components/CartButton";

import {images, offers} from "@/constants";
import useAuthStore from "@/store/auth.store";

export default function Index() {
    const {user} = useAuthStore();
    console.log("user", user);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={offers}
                renderItem={({ item, index }) => {
                    const isEven:boolean = index % 2 === 0;
                    return (
                        <View>
                            <Pressable className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')} style={{ backgroundColor: item.color }}>
                                {( pressed ) => (
                                    <Fragment>
                                        <View className="h-full w-1/2">
                                            <Image source={item.image} className="w-full h-full" resizeMode="contain" style={{ width: "100%", height: "100%" }}/>
                                        </View>
                                        <View className={cn("offer-card__info", isEven ? 'pl-10' : 'pr-10')}>
                                            <Text className="h1-bold text-white leading-tight">{item.title}</Text>
                                            <Image source={images.arrowRight} className="w-10 h-10" resizeMode="contain" tintColor="#ffffff" />

                                        </View>
                                    </Fragment>
                                )}
                            </Pressable>
                        </View>
                    )
                }}

                contentContainerClassName="pb-28 px-5"
                ListHeaderComponent = {() => (
                    <View className="flex-between flex-row w-full my-5">
                        <View className="flex-start">
                            <Text className="small-bold text-primary">DELIVER TO</Text>
                            <TouchableOpacity className="flex-center flex-row gap-x-1 my-0.5">
                                <Text className="paragraph-bold text-dark-100">Croatia</Text>
                                <Image source={images.arrowDown} className="size-3" resizeMode="contain"></Image>
                            </TouchableOpacity>
                        </View>
                        <CartButton></CartButton>

                    </View>
                )}
            />
        </SafeAreaView>
    );
}