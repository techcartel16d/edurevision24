import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import CommanHeader from '../../components/global/CommonHeader';
import { useDispatch } from 'react-redux';
import { getStudyNotesSlice } from '../../redux/userSlice';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../../utils/NavigationUtil';

const FreeStudyNotes = () => {
    const dispatch = useDispatch();
    const { theme } = useTheme();
    const { colors } = theme;
    const navigation = useNavigation();

    const [notes, setNotes] = useState([]);

    const getStudyNotesData = async () => {
        try {
            const res = await dispatch(getStudyNotesSlice()).unwrap();
            setNotes(res.data?.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getStudyNotesData();
    }, []);

    const handleViewPdf = (url) => {
        if (url) {
            navigate('PdfPreviewScreeen', { url });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <CommanHeader heading={'Study Notes'} />
            <FlatList
                data={notes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
                        <Text style={[styles.title, { color: colors.textClr }]}>
                            {item.title}
                        </Text>
                        <Text style={[styles.date, { color: colors.textClr }]}>
                            Date: {item.formatted_date}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleViewPdf(item.file_path)}
                            style={[styles.downloadBtn, { backgroundColor: colors.lightBlue }]}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>View PDF</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default FreeStudyNotes;

const styles = StyleSheet.create({
    card: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        marginTop: 5,
        fontSize: 12,
    },
    downloadBtn: {
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
});
