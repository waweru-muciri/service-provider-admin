import React, { useEffect, useLayoutEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAppointmentsForServiceProvider } from '../reducers';
import { List } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import PageTitle from '../components/PageTitle';
import PageHeader from '../components/PageHeader';

function AppointmentsScreen({ navigation, fetchAppointments, appointments }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Appointments',
        });
    }, []);

    useEffect(() => {
        fetchAppointments()
    }, [])


    return (
        <ScrollView>
            <View style={{ flex: 1 }}>
                <PageHeader>
                    <PageTitle>Your scheduled appointments</PageTitle>
                </PageHeader>
                <View style={{ width: "90%", marginLeft: "auto", marginRight: "auto", paddingTop: 20, paddingBottom: 20, }}>
                    <View style={{ flex: 1 }}>
                        <List.Section>
                            {
                                [...appointments].map((appointment) => (
                                    <List.Item
                                        key={appointment?.id}
                                        title={appointment?.title}
                                        description={appointment?.description}
                                        left={(props) => <List.Icon {...props} icon="calendar-today" />}
                                    />))
                            }
                        </List.Section>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const mapStateToProps = (state) => {

    return {
        user: state.user,
        appointments: state.appointments,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAppointments: (url) => {
            dispatch(getAppointmentsForServiceProvider())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentsScreen);
