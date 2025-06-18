import SignInBackground from '@/components/svg/SignInScreenBackground/SignInScreenBackground';
import Logo from '@/components/svg/logo';

export enum SvgTypes {
	background = 'background',
	logo = 'logo',
}

const Vector = ({ type }: { type: SvgTypes }) => {
	if (type === SvgTypes.background) {
		return <SignInBackground />;
	}

	if (type === SvgTypes.logo) {
		return <Logo />;
	}

	return null;
};

export default Vector;
