// import React, { useState } from 'react';
// import 'react-image-crop/dist/ReactCrop.css';

// const ImageUploadCrop: React.FC = () => {
//     const [selectedFile, setSelectedFile] = useState<string | null>(null);
//     const [crop, setCrop] = useState<any>({ aspect: 1, unit: 'px', width: 100 });
//     const [croppedImage, setCroppedImage] = useState<string | null>(null);

//     const onDrop = (acceptedFiles: File[]) => {
//         if (acceptedFiles && acceptedFiles.length > 0) {
//             const file = acceptedFiles[0];
//             setSelectedFile(URL.createObjectURL(file));
//         }
//     };

//     const onCropComplete = (cropData: Crop) => {
//         getCroppedImage(cropData);
//     };

//     const getCroppedImage = (cropData: Crop) => {
//         if (selectedFile) {
//             const image = new Image();
//             image.src = selectedFile;
//             image.onload = () => {
//                 const canvas = document.createElement('canvas');
//                 const scaleX = image.naturalWidth / image.width;
//                 const scaleY = image.naturalHeight / image.height;
//                 canvas.width = cropData.width || 0;
//                 canvas.height = cropData.height || 0;
//                 const ctx = canvas.getContext('2d');
//                 if (ctx) {
//                     ctx.drawImage(
//                         image,
//                         cropData.x * scaleX,
//                         cropData.y * scaleY,
//                         (cropData.width || 0) * scaleX,
//                         (cropData.height || 0) * scaleY,
//                         0,
//                         0,
//                         cropData.width || 0,
//                         cropData.height || 0
//                     );
//                     const croppedImageUrl = canvas.toDataURL('image/jpeg');
//                     setCroppedImage(croppedImageUrl);
//                 }
//             };
//         }
//     };

//     const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

//     return (
//         <div>
//             <div {...getRootProps()} style={dropzoneStyle}>
//                 <input {...getInputProps()} />
//                 <p>Drag 'n' drop an image here, or click to select one</p>
//             </div>
//             {selectedFile && (
//                 <ReactCrop
//                     src={selectedFile}
//                     crop={crop}
//                     onChange={(newCrop: Crop) => setCrop(newCrop)}
//                     onComplete={onCropComplete}
//                 />
//             )}
//             {croppedImage && (
//                 <div>
//                     <h2>Cropped Image Preview</h2>
//                     <img src={croppedImage} alt="Cropped" style={{ maxWidth: '100%' }} />
//                 </div>
//             )}
//         </div>
//     );
// };

// const dropzoneStyle: React.CSSProperties = {
//     border: '2px dashed #ccc',
//     borderRadius: '4px',
//     padding: '20px',
//     textAlign: 'center',
//     cursor: 'pointer',
// };

// export default ImageUploadCrop;
