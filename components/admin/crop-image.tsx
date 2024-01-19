import React, { useState } from 'react';
// import ReactCrop, { type Crop } from 'react-image-crop';
import ReactCrop, { Crop, PercentCrop, centerCrop, makeAspectCrop, PixelCrop, ReactCropState } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CustomModal from '@/components/admin/custom-modal';

interface componentProps {
    src?: string;
    onGetCroppedImgUrl: (img: string) => void;
}

export async function getStaticPaths() {
    const paths: any[] = [];
    return { paths, fallback: false };
}

const Index: React.FC<componentProps> = ({ src, onGetCroppedImgUrl }) => {

    const [crop, setCrop] = useState<Crop>({ unit: 'px', x: 25, y: 25, width: 150, height: 150 });
    const [croppedImg, setCroppedImg] = React.useState<string>();
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);

    const onChange = (crop: Crop, percentCrop: PercentCrop) => {
        console.log('onChange');
        setIsCompleted(false);
        setCrop(crop);
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        console.log('onImageLoad');
        setIsCompleted(false);
        // const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
        // const crop = centerCrop(makeAspectCrop({ unit: '%', width: 50, height: 50 }, 16 / 9, width, height), width, height);
        // setCrop(crop);
    }

    const onDragStart = (e: PointerEvent) => {
        console.log('onDragStart', e);
        setIsCompleted(false);
    };

    const onDragEnd = (e: PointerEvent) => {
        console.log('onDragEnd', e);
        setIsCompleted(false);
    };

    const onComplete = (crop: PixelCrop, percentCrop: PercentCrop) => {
        console.log('onComplete');
        console.log('crop', crop);
        console.log('percentCrop', percentCrop);
        setIsCompleted(true);

        if (src && crop.width && crop.height) {
            const imageElement = new Image();
            imageElement.src = src;
            imageElement.onload = () => {
                getCroppedImg(imageElement, crop).then(croppedBlob => {
                    const croppedImageUrl = URL.createObjectURL(croppedBlob);
                    onGetCroppedImgUrl(croppedImageUrl);
                    setCroppedImg(croppedImageUrl);
                });
            };
        }

    };

    const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width || 0;
        canvas.height = crop.height || 0;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return Promise.reject(new Error('Could not get canvas context'));
        }

        ctx.drawImage(image, (crop.x || 0) * scaleX, (crop.y || 0) * scaleY, (crop.width || 0) * scaleX, (crop.height || 0) * scaleY, 0, 0, crop.width || 0, crop.height || 0);

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg');
        });
    }

    React.useEffect(() => {

        console.log('Cropped in');

        return () => {
            console.log('Cropped out');
        };
    }, []);

    const toggleModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <CustomModal isModalVisible={isModalVisible} onClick={toggleModal}>
                <div className='crop-img-wrapper'>
                    <ReactCrop crop={crop} onChange={onChange} onComplete={onComplete} onDragStart={onDragStart} onDragEnd={onDragEnd} locked={true}>
                        <div>{src && <img src={src} onLoad={onImageLoad} />}</div>
                    </ReactCrop>
                    <div>{croppedImg && <img src={croppedImg} />}</div>
                </div>
            </CustomModal>
        </>
    );
};

export default React.memo(Index);
