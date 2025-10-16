import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplaceScreen from '../screens/splace/SplaceScreen';
import { navigationRef } from '../utils/NavigationUtil';
import { NavigationContainer } from '@react-navigation/native'
import LoginScreen from '../screens/auth/login/LoginScreen';
import RegisterScreen from '../screens/auth/register/RegisterScreen';
import OtpScreen from '../screens/auth/otp/OtpScreen';
import ForgotPasswordScreen from '../screens/auth/forgotpassword/ForgotPasswordScreen';
import DrawerRoutesNavigation from './DrawerNavigation';
import ExamCategoryScreen from '../screens/examcategory/ExamCategoryScreen';
import QuizePackageScreen from '../screens/quizePackage/QuizePackageScreen';
import QuizStartScreen from '../screens/quizePackage/QuizStartScreen';
import InstructionsScreen from '../screens/quizePackage/InstructionsScreen';
import ResultScreen from '../screens/quizePackage/ResultScreen';
import SolutionScreen from '../screens/quizePackage/SolutionScreen';
import MyDownloadScreen from '../screens/MyDownload/MyDownloadScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/editProfile/EditProfileScreen';
import SetPasswordScreen from '../screens/auth/setPassword/SetPasswordScreen';
import QuizePackageTestScreen from '../screens/quizePackage/QuizePackageTestSeriesScreen';
import QuizePackageTestSeriesScreen from '../screens/quizePackage/QuizePackageTestSeriesScreen';
import VerifyForgotOtpScreen from '../screens/auth/forgotpassword/VerifyForgotOtpScreen';
import ForgotPasswordSetPassword from '../screens/auth/forgotpassword/ForgotPasswordSetPassword';
import GameQuizScreen from '../screens/gameQuize/GameQuizScreen';
import CureentAffairsDetailsScreen from '../screens/mypurchase/CureentAffairsDetailsScreen';
import StudySaveItemDetailsScreen from '../drawerScreen/study/StudySaveItemDetailsScreen';
import ReferEarnScreen from '../drawerScreen/refersEarn/ReferEarnScreen';
import SubscriptionsScreen from '../screens/subcription/SubscriptionsScreen';
import TransactionsScreen from '../drawerScreen/transactions/TransactionsScreen';
import StudySaveItemScreen from '../drawerScreen/study/StudySaveItemScreen';
import TermsConditionScreen from '../drawerScreen/termcondition/TermsConditionScreen';
import SettingScreen from '../drawerScreen/setting/SettingScreen';
import PrivacyPolicyScreen from '../screens/privacy_policy/PrivacyPolicyScreen';
import HelpSupportScreen from '../screens/helpSupport/HelpSupportScreen';
import FreeQuizeScreen from '../screens/studyAllMaterial/FreeQuizeScreen';
import FreeCurrentAffareScreen from '../screens/studyAllMaterial/FreeCurrentAffareScreen';
import FreeTopicswisePaper from '../screens/studyAllMaterial/FreeTopicswisePaper';
import FreePrevieousPaperScreen from '../screens/studyAllMaterial/FreePrevieousPaperScreen';
import FreeExamInofScreen from '../screens/studyAllMaterial/FreeExamInofScreen';
import FreeStudyNotes from '../screens/studyAllMaterial/FreeStudyNotes';
import MindMapsScreen from '../screens/studyAllMaterial/MindMapsScreen';
import MindMapDetailsScreen from '../screens/studyAllMaterial/MindMapDetailsScreen';
import PdfPreviewScreeen from '../screens/pdfPreview/PdfPreviewScreeen';
import PreviouseExamInstructionScreen from '../screens/studyAllMaterial/PreviouseExamInstructionScreen';
import PreviouseYearQuestionAttendScreen from '../screens/studyAllMaterial/PreviouseYearQuestionAttendScreen';
import PreviouseYearResultScreen from '../screens/studyAllMaterial/PreviouseYearResultScreen';
import MegaQuizeAttendScreen from '../screens/gameQuize/MegaQuizeAttendScreen';
import MegaQuizeResultScreen from '../screens/gameQuize/MegaQuizeResultScreen';
import WalletScreen from '../drawerScreen/wallet/WalletScreen';
import SecheduleCallScreen from '../screens/helpSupport/SecheduleCallScreen';
import RaiseYourQuery from '../screens/helpSupport/RaiseYourQuery';
import AddBankScreen from '../screens/addBank/AddBankScreen';
import SubscriptionOrderPay from '../screens/subcription/SubscriptionOrderPay';
import StudyCollectionScreen from '../drawerScreen/collection/StudyCollectionScreen';
import CollectionDetailsScreen from '../drawerScreen/collection/CollectionDetailsScreen';
import SelectedExamCategoryScreen from '../drawerScreen/selectedExamCate/SelectedExamCategoryScreen';
import ScholarShipVideoScreen from '../screens/scholarship/ScholarShipVideoScreen';
import ScolarShipSignleVideoScreen from '../screens/scholarship/ScolarShipSignleVideoScreen';
import FreeExampInfoDetailsScreen from '../screens/studyAllMaterial/FreeExampInfoDetailsScreen';
import ScholarShipVideoTestScreen from '../screens/scholarship/ScholarShipVideoTestScreen';
import ScholarShipInstructionScreen from '../screens/scholarship/ScholarShipInstructionScreen';
import ScholarShipTestStartScreen from '../screens/scholarship/ScholarShipTestStartScreen';
import ScholarShipResultScreen from '../screens/scholarship/ScholarShipResultScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import SubscriptionActiveScreen from '../screens/subcription/SubscriptionActiveScreen';
import PracticeBatchScreen from '../screens/practicBatch/PracticeBatch';
import PurchasedBatch from '../screens/practicBatch/PurchasedBatch';
import BatchVideos from '../screens/practicBatch/BatchVideos';
import AttemptedTestPage from '../screens/attempted/AttemptedTestPage';
import  AnaylisScreen from '../screens/attempted/AnaylisScreen'
import SubscriptionPaymentSummary from '../screens/subcription/SubscriptionPaymentSummary';




// Navigators
const Stack = createNativeStackNavigator();
// Auth Stack
const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="SetPasswordScreen" component={SetPasswordScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyForgotOtpScreen" component={VerifyForgotOtpScreen} />
        <Stack.Screen name="ForgotPasswordSetPassword" component={ForgotPasswordSetPassword} />
        <Stack.Screen name="TermsConditionScreen" component={TermsConditionScreen} />
         <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
)

// Drawer Navigator
const NoAuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, }}>
            <Stack.Screen name='DrawerRoutesNavigation' component={DrawerRoutesNavigation} />

        </Stack.Navigator>
    )
}

// Main Navigation
const MainNavigator = () => {
    return (

        <Stack.Navigator screenOptions={{ headerShown: false, }}>
            <Stack.Screen name="SplaceScreen" component={SplaceScreen} />
            <Stack.Screen name="AuthStack" component={AuthStack} />
            <Stack.Screen name="NoAuthStack" component={NoAuthStack} />
            <Stack.Screen name="ExamCategoryScreen" component={ExamCategoryScreen} />
            <Stack.Screen name="QuizePackageScreen" component={QuizePackageScreen} />
            <Stack.Screen name="QuizStartScreen" component={QuizStartScreen} />
            <Stack.Screen name="InstructionsScreen" component={InstructionsScreen} />
            <Stack.Screen name="ResultScreen" component={ResultScreen} />
            <Stack.Screen name="SolutionScreen" component={SolutionScreen} />
            <Stack.Screen name="MyDownloadScreen" component={MyDownloadScreen} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="QuizePackageTestSeriesScreen" component={QuizePackageTestSeriesScreen} />
            <Stack.Screen name="SelectedExamCategoryScreen" component={SelectedExamCategoryScreen} />

            <Stack.Screen name="CureentAffairsDetailsScreen" component={CureentAffairsDetailsScreen} />
            <Stack.Screen name="StudySaveItemDetailsScreen" component={StudySaveItemDetailsScreen} />
            <Stack.Screen name="TermsConditionScreen" component={TermsConditionScreen} />
            <Stack.Screen name="ReferEarnScreen" component={ReferEarnScreen} />
            <Stack.Screen name="SubscriptionsScreen" component={SubscriptionsScreen} />
            <Stack.Screen name="SubscriptionOrderPay" component={SubscriptionOrderPay} />

            <Stack.Screen name="TransactionsScreen" component={TransactionsScreen} />
            <Stack.Screen name="StudySaveItemScreen" component={StudySaveItemScreen} />
            <Stack.Screen name="StudyCollectionScreen" component={StudyCollectionScreen} />
            <Stack.Screen name="CollectionDetailsScreen" component={CollectionDetailsScreen} />

            <Stack.Screen name="SettingScreen" component={SettingScreen} />


            {/* ADD BALANCE ADD BANK */}
            <Stack.Screen name="WalletScreen" component={WalletScreen} />
            <Stack.Screen name="AddBankScreen" component={AddBankScreen} />

            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />

            {/* HELP AND SUPPORT ROUTE */}
            <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
            <Stack.Screen name="SecheduleCallScreen" component={SecheduleCallScreen} />
            <Stack.Screen name="RaiseYourQuery" component={RaiseYourQuery} />

            {/* SCHOLAR SHIP ROUTE */}
            <Stack.Screen name="ScholarShipVideoScreen" component={ScholarShipVideoScreen} />
            <Stack.Screen name="ScolarShipSignleVideoScreen" component={ScolarShipSignleVideoScreen} />
            <Stack.Screen name="ScholarShipVideoTestScreen" component={ScholarShipVideoTestScreen} />
            <Stack.Screen name="ScholarShipInstructionScreen" component={ScholarShipInstructionScreen} />
            <Stack.Screen name="ScholarShipTestStartScreen" component={ScholarShipTestStartScreen} />
            <Stack.Screen name="ScholarShipResultScreen" component={ScholarShipResultScreen} />


            <Stack.Screen name="FreeQuizeScreen" component={FreeQuizeScreen} />
            <Stack.Screen name="FreeCurrentAffareScreen" component={FreeCurrentAffareScreen} />
            <Stack.Screen name="FreeTopicswisePaper" component={FreeTopicswisePaper} />
            <Stack.Screen name="FreeExamInofScreen" component={FreeExamInofScreen} />
            <Stack.Screen name="FreeExampInfoDetailsScreen" component={FreeExampInfoDetailsScreen} />
            <Stack.Screen name="FreeStudyNotes" component={FreeStudyNotes} />
            <Stack.Screen name="MindMapsScreen" component={MindMapsScreen} />
            <Stack.Screen name="MindMapDetailsScreen" component={MindMapDetailsScreen} />
            <Stack.Screen name="PdfPreviewScreeen" component={PdfPreviewScreeen} />
            <Stack.Screen name="FreePrevieousPaperScreen" component={FreePrevieousPaperScreen} />
            <Stack.Screen name="PreviouseExamInstructionScreen" component={PreviouseExamInstructionScreen} />
            <Stack.Screen name="PreviouseYearQuestionAttendScreen" component={PreviouseYearQuestionAttendScreen} />
            <Stack.Screen name="PreviouseYearResultScreen" component={PreviouseYearResultScreen} />
            {/* MEGA QUIZE ROUTES */}
            <Stack.Screen name="GameQuizScreen" component={GameQuizScreen} />
            <Stack.Screen name="MegaQuizeAttendScreen" component={MegaQuizeAttendScreen} />
            <Stack.Screen name="MegaQuizeResultScreen" component={MegaQuizeResultScreen} />


            {/* Payment route */}

            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="SubscriptionActiveScreen" component={SubscriptionActiveScreen} />

            {/* Practic Batch */}
            <Stack.Screen name="PracticeBatchScreen" component={PracticeBatchScreen} />
            <Stack.Screen name="PurchasedBatch" component={PurchasedBatch} />
            <Stack.Screen name="BatchVideos" component={BatchVideos} />


            {/* Attempt test  */}

           <Stack.Screen name="AttemptedTestPage" component={AttemptedTestPage} />
           <Stack.Screen name="AnaylisScreen" component={AnaylisScreen} />



           <Stack.Screen name="SubscriptionPaymentSummary" component={SubscriptionPaymentSummary} />




        </Stack.Navigator>
    )
}



const AllRoutes = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <MainNavigator />
        </NavigationContainer>
    )
}

export default AllRoutes

const styles = StyleSheet.create({})