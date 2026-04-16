import { Pressable, Text } from '@/tw';
import { Href, useRouter } from 'expo-router';
import { PressableProps } from 'react-native';

type ButtonProps = PressableProps & {
    title: string;
    variant?: 'primary' | 'secondary' | 'link';
    href?: Href;
};

const baseClassName = 'px-6 py-5 rounded-xl items-center justify-center shadow-md active:scale-[0.95]';
const variants = {
    primary: 'bg-[#000]',
    secondary: 'border border-black bg-transparent',
    link: 'bg-transparent shadow-none',
};

const baseTextClassName = 'font-bold text-xl tracking-wide';
const textVariants = {
    primary: 'text-white',
    secondary: 'text-black',
    link: 'text-black',
};

export default function Button({
    title,
    variant = 'primary',
    className = '',
    disabled,
    href,
    onPress,
    ...props
}: ButtonProps) {
    const router = useRouter();

    const handlePress: PressableProps['onPress'] = (e) => {
        if (href) {
            router.push(href);
        }
        onPress?.(e);
    };

    return (
        <Pressable
            {...props}
            onPress={handlePress}
            disabled={disabled}
            className={`${baseClassName} ${variants[variant]} ${className}`}
            style={{ opacity: disabled ? 0.5 : 1 }}
        >
            <Text className={`${baseTextClassName} ${textVariants[variant]}`}>
                {title}
            </Text>
        </Pressable>
    );
}
