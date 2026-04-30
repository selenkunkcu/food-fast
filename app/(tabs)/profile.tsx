import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { ProfileFieldProps } from "@/type";

const ProfileField = ({ icon, label, value }: ProfileFieldProps) => {
    return (
        <View className="profile-field">
            <View className="profile-field__icon">
                <Image source={icon} className="size-5" resizeMode="contain" tintColor="#FE8C00" />
            </View>

            <View className="flex-1">
                <Text className="body-regular text-gray-200">{label}</Text>
                <Text className="paragraph-semibold text-dark-100 mt-1">{value}</Text>
            </View>
        </View>
    );
};

export default function Profile() {
    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView className="px-5" showsVerticalScrollIndicator={false} contentContainerClassName="pb-32">
                <CustomHeader title="Profile" />

                <View className="flex-center mb-8">
                    <View className="relative">
                        <Image source={{ uri: "https://i.pravatar.cc/200?img=12" }} className="profile-avatar" resizeMode="cover" />

                        <TouchableOpacity className="profile-edit">
                            <Image source={images.pencil} className="size-3" resizeMode="contain" tintColor="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-white rounded-3xl p-5 shadow-md shadow-black/10 mb-8">
                    <ProfileField icon={images.user} label="Full Name" value="Selen Gökbel" />

                    <ProfileField icon={images.envelope} label="Email" value="selen.gokbel@example.com" />

                    <ProfileField icon={images.phone} label="Phone number" value="+1 555 123 4567" />

                    <ProfileField icon={images.location} label="Address" value="123 Main Street, Springfield, IL 62704" />
                </View>

                <CustomButton title="Edit Profile" style="bg-transparent border border-primary mb-4" textStyle="text-primary" />
                <CustomButton title="Logout" style="bg-transparent border border-red-400" textStyle="text-red-400" leftIcon={<Image source={images.logout} className="w-5 h-5 mr-2" resizeMode="contain" tintColor="#EF4444" />} />
            </ScrollView>
        </SafeAreaView>
    );
}
