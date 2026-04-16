import { SafeAreaView, Text, View } from '@/tw';
import { Image } from '@/tw/image';
import { Ionicons } from '@expo/vector-icons';
import { ImageSourcePropType } from 'react-native';
// import { Confetti } from 'react-native-fast-confetti';
import Button from '@/ui/Button';
import { Href, router } from 'expo-router';

type ConfirmationScreenProps = {
  title: string;
  description: string;
  image?: ImageSourcePropType;
  continueHref?: Href;
};

export default function ConfirmationScreen({
  title,
  description,
  image,
  continueHref,
}: ConfirmationScreenProps) {
  const startCreating = () => {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/');

    if (continueHref) {
      router.push(continueHref);
    }
  };

  const goHome = () => {
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace('/');
  };

  return (
    <>
      {/* <Confetti
        fadeOutOnEnd
        autoplay
        isInfinite={false}
        verticalSpacing={50}
        count={400}
        blastDuration={1000}
        flakeSize={{ width: 4, height: 8 }}
      /> */}
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 p-6'>
          {/* Main Content */}
          <View className='flex-1 items-center justify-center gap-8'>
            {/* Icon */}
            {image && (
              <View className='bg-white rounded-3xl p-6 shadow-lg'>
                <Image
                  source={image}
                  className='w-24 h-24 rounded-2xl'
                  resizeMode='contain'
                />
              </View>
            )}

            {/* Success Message */}
            <View className='items-center gap-4'>
              <View className='w-16 h-16 bg-green-100 rounded-full items-center justify-center'>
                <Ionicons name='checkmark' size={32} color='#22c55e' />
              </View>

              <Text className='text-2xl font-bold text-gray-900 text-center'>
                {title}
              </Text>

              <Text className='text-lg text-gray-600 text-center max-w-sm leading-6'>
                {description}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className='gap-3'>
            <Button
              title='Continue'
              onPress={startCreating}
              variant='primary'
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
