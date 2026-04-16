import icon from '@/assets/images/icon.png';
import ConfirmationScreen from '@/providers/RevenueCat/ConfirmationScreen';

export default function SubscriptionConfirmation() {
    return (
        <ConfirmationScreen
            title='Welcome to Premium!'
            description='You are now a premium user! Enjoy the full experience of the app'
            image={icon}
            continueHref='/(protected)/(home)/chat/new'
        />
    );
}
