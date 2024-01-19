import React, { useState } from 'react';
import CropImage from '@/components/admin/crop-image';



const Index: React.FC = () => {

    const [imageDataUrl, setImageDataUrl] = React.useState<string>();
    const [getCroppedImg, setGetCroppedImg] = React.useState<string>();

    const selectImage = (file: File) => {
        setImageDataUrl(URL.createObjectURL(file));
    };

    const getCroppedImgUrl = (img: string) => {
        setGetCroppedImg(img);
    };

    return (
        <>
            <input type="file" id='userimg' name='userimg' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                    selectImage(e.target.files[0]);
                }
            }}
                accept="image/png, image/jpeg"
            />
            {imageDataUrl && <CropImage src={imageDataUrl} onGetCroppedImgUrl={getCroppedImgUrl} />}
        </>
    );
};

export default Index;
