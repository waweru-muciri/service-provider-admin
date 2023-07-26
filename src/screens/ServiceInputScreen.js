import { View, Text, ScrollView, Alert } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextInput, useTheme } from "react-native-paper";
import { updateServiceProviderProfile } from "../reducers";
import { connect } from "react-redux";
import PrimaryButton from "../components/PrimaryButton";
import PageHeader from "../components/PageHeader";
import PageTitle from "../components/PageTitle";


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
                        <PrimaryButton
                            disabled={isSubmitting}
                            onPress={handleSubmit(async (data) => {
                                updateProfile(userProfile.id, { ...userProfile, service: { ...data } })
                                Alert.alert("Success!", "Service saved successfully");
                            })}
                        >
                            Save
                        </PrimaryButton>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
