import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, StyleSheet } from 'react-native';
import CustomeText from '../global/CustomeText';
import { screenHeight, screenWidth } from '../../utils/Constant';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RFValue } from 'react-native-responsive-fontsize';

const FAQAccordion = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>

      <CustomeText color='#FFC000' fontSize={14} style={{ fontWeight: 'bold' }}>Frequently Asked Questions</CustomeText>
      {data.map((item, index) => (
        <View key={index} style={styles.card}>
          <TouchableOpacity onPress={() => toggle(index)} style={styles.questionBox}>
            <CustomeText color='#fff' fontSize={12 } style={styles.questionText}>{item.question}</CustomeText>
            <CustomeText color='#fff' style={styles.arrow}>{activeIndex === index ? <MaterialIcons name="keyboard-arrow-up" size={RFValue(20)} /> : <MaterialIcons name="keyboard-arrow-down" size={RFValue(20)} />}</CustomeText>
          </TouchableOpacity>
          {activeIndex === index && (
            <CustomeText fontSize={10} style={{
              fontWeight: '400',
              color:'#fff'
            }}>{item.answer}</CustomeText>
          )}
        </View>
      ))}
    </View>
  );
};




export default FAQAccordion

const styles = StyleSheet.create({
  container: {
    padding: screenWidth * 3,
    flex: 1,
    gap: screenHeight
  },
  heading: {
    fontWeight: 'bold',

  },
  card: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#333',
    padding: 12,
  },
  questionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap:screenHeight
  },
  questionText: {
    fontWeight: 'bold',
    flex: 1,
    marginBottom:screenHeight

  },
  answerText: {
    marginTop: 8,
    color: '#000',
    lineHeight: 20,
  },
  arrow: {
    fontSize: 18,
    paddingLeft: 8,
  },
});
