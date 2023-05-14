import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image, TouchableWithoutFeedback } from 'react-native';

const ModalComponent = ({ isWon, setIsWon }) => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (isWon) {
            setModalVisible(true);
        }
    }, [isWon]);

    const handleClose = () => {
        setModalVisible(false);
        setIsWon(false);
        // initializeGrid(); // Call the initializeGrid function from App.js
    };

    return (
        <TouchableWithoutFeedback onPress={handleClose}>

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onBackdropPress={() => { setModalVisible(false) }}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image
                                style={styles.image}
                                source={require('./output/trophy.png')} // Replace with your actual image path
                            />
                            <Text style={styles.modalText}>Συγχαρητήρια!</Text>
                            <Text style={styles.modalText}>Κέρδισες μια ΜΑΜΟΣ!</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={handleClose}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>

    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#fdeedeff',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 20,
    },
    buttonClose: {
        backgroundColor: '#4472c4ff',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4472c4ff',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});

export default ModalComponent;
