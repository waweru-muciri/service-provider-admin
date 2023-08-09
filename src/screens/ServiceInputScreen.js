import { View, Text, ScrollView, Alert, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextInput, useTheme } from "react-native-paper";
import { updateServiceProviderProfile, uploadImageAsync } from "../reducers";
import { connect } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import PageHeader from "../components/PageHeader";
import PageTitle from "../components/PageTitle";
import * as ImagePicker from 'expo-image-picker';


const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    price: yup
        .number()
        .typeError("Price must be a number")
        .required("Price is required"),
    description: yup.string().required("Description is required"),
});

const ServiceInputForm = ({
    navigation,
    userProfile,
    updateProfile,
}) => {

    const serviceProvided = userProfile?.service ? userProfile.service : {}
    const [serviceImage, setserviceImage] = useState(null);

    const defaultValues = {
        ...serviceProvided, price: `${serviceProvided.price}` || ""
    };


    const { colors } = useTheme();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{ flex: 1 }}>
                    <PageHeader>
                        <PageTitle>Details of offered service</PageTitle>
                    </PageHeader>
                    <View style={{ width: "90%", marginLeft: "auto", marginRight: "auto", paddingTop: 20, paddingBottom: 20, }}>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Name"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    style={{
                                        marginBottom: 20,
                                    }}
                                    keyboardType="default"
                                    error={errors.name ? true : false}
                                />
                            )}
                            name="name"
                            rules={{ required: true }}
                        />
                        {errors.name && (
                            <Text
                                variant="labelLarge"
                                style={{
                                    color: colors.error,
                                }}
                            >
                                {errors.name.message}
                            </Text>
                        )}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Description of the service"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    style={{
                                        marginBottom: 20,
                                    }}
                                    error={errors.description ? true : false}
                                />
                            )}
                            name="description"
                            rules={{ required: true }}
                        />
                        {errors.description && (
                            <Text
                                variant="labelLarge"
                                style={{
                                    color: colors.error,
                                }}
                            >
                                {errors.description.message}
                            </Text>
                        )}
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Service charges"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                    style={{
                                        marginBottom: 20,
                                    }}
                                    keyboardType="phone-pad"
                                    error={errors.price ? true : false}
                                />
                            )}
                            name="price"
                            rules={{ required: true }}
                        />
                        {errors.price && (
                            <Text
                                variant="labelLarge"
                                style={{
                                    color: colors.error,
                                }}
                            >
                                {errors.price.message}
                            </Text>
                        )}
                        {serviceImage && <Image source={{ uri: serviceImage }} style={{ width: "100%", height: 200, marginBottom: 20 }} />}
                        <Button
                            mode="outlined"
                            icon={"camera"}
                            onPress={async () => {
                                // No permissions request is necessary for launching the image library
                                let result = await ImagePicker.launchImageLibraryAsync({
                                    selectionLimit: 1,
                                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                                    allowsEditing: true,
                                    aspect: [4, 3],
                                    quality: 1,
                                });


                                if (!result.canceled) {
                                    setserviceImage(result.assets[0].uri);
                                }
                            }}
                        >
                            Pick Service Image
                        </Button>
                        <PrimaryButton
                            style={{ marginTop: 40 }}
                            disabled={isSubmitting}
                            onPress={handleSubmit(async (data) => {
                                try {
                                    let serviceImageUrl;
                                    if (serviceImage) {
                                        serviceImageUrl = await uploadImageAsync(serviceImage);
                                    }
                                    updateProfile(userProfile.id, { ...userProfile, service: { ...data, image_url: serviceImageUrl } })
                                    Alert.alert("Success!", "Service saved successfully");
                                } catch (error) {
                                    console.error(error);
                                }
                            })}
                        >
                            Save
                        </PrimaryButton>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

const mapStateToProps = (state) => {
    return {
        userProfile: state.auth.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (url, data) => {
            dispatch(updateServiceProviderProfile(url, data));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ServiceInputForm);
