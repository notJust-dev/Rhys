import { Pressable, Text } from '@/tw';
import { PressableProps, } from 'react-native';

type ButtonProps = PressableProps & {
    title: string;
    variant?: 'primary' | 'secondary' | 'link';
};

const baseClassName = 'px-6 py-6 rounded-full items-center justify-center shadow-md active:scale-95';
const variants = {
    primary: 'bg-[#000]',
    secondary: 'border border-black bg-transparent',
    link: 'bg-transparent',
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
    ...props
}: ButtonProps) {
    return (
        <Pressable
            {...props}
            className={`${baseClassName} ${variants[variant]} ${className}`}
        >
            <Text className={`${baseTextClassName} ${textVariants[variant]}`}>
                {title}
            </Text>
        </Pressable>
    );
}
