import RevenueCatUI from "react-native-purchases-ui";

export default function SubscriptionScreen() {
  return (<RevenueCatUI.CustomerCenterView
    style={{ flex: 1 }}
    shouldShowCloseButton={false}
    onCustomActionSelected={({ actionId }) => {
      console.log('Custom action:', actionId);
    }}
  />)
}
