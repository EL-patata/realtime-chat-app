import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const loading = () => {
	return (
		<div className="w-full flex flex-col gap-3">
			<Skeleton className="mb-4" height={50} width={350} />
			<Skeleton height={50} width={350} />
			<Skeleton height={50} width={350} />
		</div>
	);
};

export default loading;
